import { randomUUID } from 'crypto'
import type { Endpoint, PayloadRequest } from 'payload'

import { entregarLead, type ItemLead, type LeadOrcamento, type UtmLead } from '../integrations/crm'
import { codigoDaCor, corPorNome, normalizarNome } from '../components/produto/cores-bb'

// Endpoint publico que recebe o pedido de orcamento do site (FB-7, PART 0).
// Fluxo: form de /orcamento -> POST /api/orcamento -> adapter do Leads2b (stub por
// ora) -> grava o log de entrega (auditoria, PII minima). CORS/preflight sao
// aplicados pelo Payload a partir de `config.cors` (= FRONTEND_URL). Token do CRM,
// quando existir, fica no servidor (env), nunca no browser.

// Rate-limit minimo em memoria por IP: primeira barreira anti-abuso. NAO e duravel
// (reinicia com o container, nao compartilha entre instancias); Turnstile entra
// quando o front estiver no Cloudflare (docs/integracao-leads2b.md secao 4.anti-spam).
const JANELA_MS = 60_000
const MAX_POR_JANELA = 5
const acessosPorIp = new Map<string, number[]>()

function excedeuLimite(ip: string): boolean {
  const agora = Date.now()
  const recentes = (acessosPorIp.get(ip) ?? []).filter((t) => agora - t < JANELA_MS)
  recentes.push(agora)
  acessosPorIp.set(ip, recentes)
  return recentes.length > MAX_POR_JANELA
}

const ehTexto = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0

function mascararEmail(email: string): string {
  const [usuario, dominio] = email.split('@')
  if (!dominio) return '***'
  const inicio = usuario.length <= 2 ? usuario.slice(0, 1) : usuario.slice(0, 2)
  return `${inicio}***@${dominio}`
}

function mascararTelefone(telefone: string): string {
  const digitos = telefone.replace(/\D/g, '')
  if (digitos.length <= 4) return '****'
  return `***${digitos.slice(-4)}`
}

function json(corpo: unknown, status: number): Response {
  // O Payload reembrulha a resposta com os headers de CORS (ver handleEndpoints);
  // aqui so devolvemos o JSON com o status certo.
  return Response.json(corpo, { status })
}

// --- UTM --------------------------------------------------------------------
// Contrato com o front: campo opcional `utm` com chaves camelCase (sem prefixo
// "utm_"), todas strings opcionais. O front pode omitir ou mandar {}. Aqui saneamos:
// so strings, trim, teto de 200 chars, descartando vazios. Nunca quebra se vier
// ausente ou malformado (retorna undefined).
const CHAVES_UTM = ['source', 'medium', 'campaign', 'term', 'content'] as const
const LIMITE_UTM = 200

function limparUtm(bruto: unknown): UtmLead | undefined {
  if (!bruto || typeof bruto !== 'object' || Array.isArray(bruto)) return undefined
  const entrada = bruto as Record<string, unknown>
  const utm: UtmLead = {}
  for (const chave of CHAVES_UTM) {
    const valor = entrada[chave]
    if (typeof valor !== 'string') continue
    const limpo = valor.trim().slice(0, LIMITE_UTM)
    if (limpo) utm[chave] = limpo
  }
  return Object.keys(utm).length > 0 ? utm : undefined
}

// --- Enriquecimento do item -------------------------------------------------
// Para cada item (produtoSlug + cor), busca o produto no cadastro e deriva os
// campos que o CRM/Leads2b precisa: codigoCigam, codigoCor, refCrm e categorias.
// Tudo best-effort: produto nao achado ou dado faltando NAO quebra o orcamento,
// so deixa de preencher aquele campo.

type RegistroSolto = Record<string, unknown>

// Casa o NOME da cor escolhida no item com cores[].nome do produto e devolve o
// codigo da tabela mestra (mesma logica do CodigosPorCorView via codigoDaCor).
// Se nao casar nenhuma cor do produto, tenta casar direto na paleta mestra pelo
// nome que veio (fallback), senao undefined.
function resolverCodigoCor(cores: unknown, corItem?: string): string | undefined {
  if (!corItem) return undefined
  const alvo = normalizarNome(corItem)
  if (Array.isArray(cores)) {
    for (const entrada of cores) {
      if (!entrada || typeof entrada !== 'object') continue
      const nome = (entrada as RegistroSolto).nome
      if (typeof nome === 'string' && normalizarNome(nome) === alvo) {
        const codigo = codigoDaCor(entrada as { nome?: string | null; codigo?: string | null })
        if (codigo) return codigo
      }
    }
  }
  return corPorNome(corItem)?.codigo
}

// Extrai os slugs (ou nomes) das categorias do produto. Com depth >= 1 as
// categorias vem populadas como objeto; se vierem so como id, ignora.
function extrairCategorias(cats: unknown): string[] {
  if (!Array.isArray(cats)) return []
  const out: string[] = []
  for (const cat of cats) {
    if (!cat || typeof cat !== 'object') continue
    const registro = cat as RegistroSolto
    const slug = registro.slug
    const nome = registro.nome
    if (typeof slug === 'string' && slug.trim()) out.push(slug.trim())
    else if (typeof nome === 'string' && nome.trim()) out.push(nome.trim())
  }
  return out
}

async function enriquecerItens(
  payload: PayloadRequest['payload'],
  itens: ItemLead[],
): Promise<ItemLead[]> {
  const slugs = Array.from(new Set(itens.map((i) => i.produtoSlug).filter(Boolean)))
  if (slugs.length === 0) return itens

  const produtosPorSlug = new Map<string, RegistroSolto>()
  try {
    const res = await payload.find({
      collection: 'produtos',
      where: { slug: { in: slugs } },
      depth: 1,
      limit: slugs.length,
      pagination: false,
    })
    for (const doc of res.docs as unknown as RegistroSolto[]) {
      if (typeof doc.slug === 'string') produtosPorSlug.set(doc.slug, doc)
    }
  } catch (e) {
    // Best-effort: se a consulta falhar, segue com os itens crus (orcamento nao para).
    payload.logger.error(
      `[orcamento] falha ao enriquecer itens: ${e instanceof Error ? e.message : String(e)}`,
    )
    return itens
  }

  return itens.map((item) => {
    const produto = item.produtoSlug ? produtosPorSlug.get(item.produtoSlug) : undefined
    if (!produto) return item

    const cigamBruto = produto.codigoCigam
    const codigoCigam = typeof cigamBruto === 'string' && cigamBruto.trim() ? cigamBruto.trim() : undefined
    const codigoCor = resolverCodigoCor(produto.cores, item.cor)
    const refCrm = codigoCigam && codigoCor ? `${codigoCigam}-${codigoCor}` : undefined
    const categorias = extrairCategorias(produto.categorias)

    return {
      ...item,
      ...(codigoCigam ? { codigoCigam } : {}),
      ...(codigoCor ? { codigoCor } : {}),
      ...(refCrm ? { refCrm } : {}),
      ...(categorias.length > 0 ? { categorias } : {}),
    }
  })
}

export const orcamentoEndpoint: Endpoint = {
  path: '/orcamento',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    let corpo: Record<string, unknown> = {}
    try {
      corpo = req.json ? ((await req.json()) as Record<string, unknown>) : {}
    } catch {
      corpo = {}
    }

    // Honeypot: campo invisivel que humano nao preenche. Preenchido = bot. Devolve
    // 200 (nao da pista ao abusador), sem logar nem entregar.
    if (ehTexto(corpo.website)) {
      return json({ ok: true }, 200)
    }

    const ip = (req.headers?.get('x-forwarded-for') ?? '').split(',')[0]?.trim() || 'desconhecido'
    if (excedeuLimite(ip)) {
      return json(
        { ok: false, erro: 'Muitas tentativas em pouco tempo. Aguarde um instante e tente de novo.' },
        429,
      )
    }

    const solicitante = (corpo.solicitante ?? {}) as Record<string, unknown>
    const itensBrutos = Array.isArray(corpo.itens) ? (corpo.itens as Record<string, unknown>[]) : []
    const consentimento = corpo.consentimento === true

    // Validacao server-side (espelha o front; o backend nao confia no cliente).
    const campos: string[] = []
    if (!ehTexto(solicitante.nome)) campos.push('nome')
    if (!ehTexto(solicitante.empresa)) campos.push('empresa')
    if (!ehTexto(solicitante.telefone)) campos.push('telefone')
    if (!ehTexto(solicitante.email) || !/^\S+@\S+\.\S+$/.test(String(solicitante.email))) campos.push('email')
    if (itensBrutos.length === 0) campos.push('itens')
    if (!consentimento) campos.push('consentimento')
    if (campos.length > 0) {
      return json({ ok: false, erro: 'Dados invalidos.', campos }, 400)
    }

    // Normaliza os itens: so o necessario pro lead, ignorando campos extras do
    // carrinho (ex.: imagem). Teto de 100 itens pra limitar payload.
    const itens: ItemLead[] = itensBrutos
      .filter((i) => ehTexto(i?.nome) && Number.isFinite(Number(i?.quantidade)))
      .slice(0, 100)
      .map((i) => ({
        produtoSlug: ehTexto(i.produtoSlug) ? String(i.produtoSlug) : '',
        nome: String(i.nome),
        cor: ehTexto(i.cor) ? String(i.cor) : undefined,
        quantidade: Math.max(0, Math.trunc(Number(i.quantidade))),
      }))

    if (itens.length === 0) {
      return json({ ok: false, erro: 'Dados invalidos.', campos: ['itens'] }, 400)
    }

    const totalUnidades = itens.reduce((acc, i) => acc + i.quantidade, 0)
    const requisicaoId = randomUUID()

    // Enriquece os itens com os dados do CRM (cigam/cor/refCrm/categorias) e saneia
    // o UTM. Enriquecimento e best-effort: nunca derruba o orcamento.
    const itensEnriquecidos = await enriquecerItens(req.payload, itens)
    const utm = limparUtm(corpo.utm)

    // Categorias agregadas (unicas) pro log de auditoria. Nao e PII.
    const categoriasAgregadas = Array.from(
      new Set(itensEnriquecidos.flatMap((i) => i.categorias ?? [])),
    )

    const lead: LeadOrcamento = {
      solicitante: {
        nome: String(solicitante.nome),
        empresa: String(solicitante.empresa),
        telefone: String(solicitante.telefone),
        email: String(solicitante.email),
      },
      itens: itensEnriquecidos,
      total: totalUnidades,
      ...(utm ? { utm } : {}),
    }

    const resultado = await entregarLead(lead, requisicaoId)

    // Log de entrega (auditoria + PII minima/mascarada). Criado via Local API, que
    // ignora o access `create: () => false` da collection (so o endpoint grava).
    // `logs-entrega` e collection nova; ate o payload-types.ts ser regenerado, o
    // slug nao esta no union tipado, entao tipamos o create de forma solta.
    const criarLog = req.payload.create as (args: {
      collection: string
      data: Record<string, unknown>
    }) => Promise<unknown>
    try {
      await criarLog({
        collection: 'logs-entrega',
        data: {
          requisicaoId,
          status: resultado.status,
          modo: resultado.modo,
          crmId: resultado.status === 'entregue' ? resultado.crmId : null,
          erro: resultado.status === 'falhou' ? resultado.erro : undefined,
          empresa: lead.solicitante.empresa,
          emailMascarado: mascararEmail(lead.solicitante.email),
          telefoneMascarado: mascararTelefone(lead.solicitante.telefone),
          qtdItens: itens.length,
          totalUnidades,
          consentimento,
          categorias: categoriasAgregadas.length > 0 ? categoriasAgregadas : undefined,
          utm: utm ?? undefined,
        },
      })
    } catch (e) {
      // Nunca derruba a resposta por causa do log; so registra no Deploy Logs.
      req.payload.logger.error(
        `[orcamento] falha ao gravar log de entrega (${requisicaoId}): ${e instanceof Error ? e.message : String(e)}`,
      )
    }

    if (resultado.status === 'falhou') {
      return json(
        { ok: false, erro: 'Nao foi possivel enviar agora. Tente pelo WhatsApp na proxima tela.' },
        502,
      )
    }

    return json({ ok: true, requisicaoId }, 200)
  },
}
