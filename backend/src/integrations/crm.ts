// Adapter de entrega do lead ao CRM (FB-7). O orcamento do site e entregue ao CRM
// da BB via um fluxo n8n (webhook): o backend NAO fala direto com a API do CRM, so
// repassa o lead pro n8n, que cuida do mapeamento (planilha + CRM). Mantem o
// token/segredo fora do browser e desacopla do CRM final (decidido com Douglas/Julien).
//
// Estado: sem `N8N_WEBHOOK_URL`, roda em STUB (nada e enviado; o caminho de entrega
// e o WhatsApp da tela de sucesso). Com a URL setada, faz POST do lead no webhook.

export type SolicitanteLead = {
  nome: string
  empresa: string
  telefone: string
  email: string
}

export type ItemLead = {
  produtoSlug: string
  nome: string
  cor?: string
  quantidade: number
}

export type LeadOrcamento = {
  solicitante: SolicitanteLead
  itens: ItemLead[]
  total: number
}

export type ResultadoEntrega =
  | { status: 'simulado'; modo: 'stub'; crmId: null }
  | { status: 'entregue'; modo: 'real'; crmId: string | null }
  | { status: 'falhou'; modo: 'real'; erro: string }

// Timeout do POST pro n8n, pra uma instancia lenta/fora do ar nao segurar a resposta
// do site. No estouro, trata como falha (o endpoint devolve 502 e o front cai no WhatsApp).
const TIMEOUT_MS = 10_000

// Tenta achar um id de retorno do n8n/CRM no corpo da resposta (opcional; o n8n pode
// nem devolver). Qualquer um desses campos serve; senao, null.
function extrairCrmId(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null
  const o = body as Record<string, unknown>
  const cand = o.crmId ?? o.leadId ?? o.id
  return typeof cand === 'string' || typeof cand === 'number' ? String(cand) : null
}

// Entrega o lead ao CRM via o webhook do n8n. Sem a URL, stub (nada sai).
export async function entregarLead(
  lead: LeadOrcamento,
  requisicaoId: string,
): Promise<ResultadoEntrega> {
  const webhookURL = process.env.N8N_WEBHOOK_URL

  if (!webhookURL) {
    return { status: 'simulado', modo: 'stub', crmId: null }
  }

  const token = process.env.N8N_WEBHOOK_TOKEN
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const resp = await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        requisicaoId,
        origem: 'site-bbbrindes/orcamento',
        solicitante: lead.solicitante,
        itens: lead.itens,
        total: lead.total,
      }),
      signal: controller.signal,
    })

    if (!resp.ok) {
      return { status: 'falhou', modo: 'real', erro: `n8n respondeu HTTP ${resp.status}` }
    }

    // A resposta pode nao ser JSON; se for, tenta pegar um id do CRM.
    let crmId: string | null = null
    try {
      crmId = extrairCrmId(await resp.json())
    } catch {
      crmId = null
    }
    return { status: 'entregue', modo: 'real', crmId }
  } catch (e) {
    const erro =
      e instanceof Error && e.name === 'AbortError'
        ? 'timeout ao enviar pro n8n'
        : e instanceof Error
          ? e.message
          : String(e)
    return { status: 'falhou', modo: 'real', erro }
  } finally {
    clearTimeout(timer)
  }
}
