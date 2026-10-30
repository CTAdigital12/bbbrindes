import { randomUUID } from 'crypto'
import type { Endpoint, PayloadRequest } from 'payload'

import { entregarLead, type ItemLead, type LeadOrcamento } from '../integrations/leads2b'

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

    const lead: LeadOrcamento = {
      solicitante: {
        nome: String(solicitante.nome),
        empresa: String(solicitante.empresa),
        telefone: String(solicitante.telefone),
        email: String(solicitante.email),
      },
      itens,
      total: totalUnidades,
    }

    const resultado = await entregarLead(lead)

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
