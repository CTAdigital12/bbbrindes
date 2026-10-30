// Adapter do CRM Leads2b atras de interface (FB-7, PART 0 da entrega da cotacao).
// O envio real do lead ao CRM fica ISOLADO aqui, pra plugar o endpoint de verdade
// depois sem mexer no resto. Fonte da verdade do desenho: docs/integracao-leads2b.md.
//
// Estado atual = STUB. O token (LEADS2B_TOKEN) e o formato exato do endpoint de
// criar lead ainda dependem do cliente (PART 1). Enquanto isso, `entregarLead`
// NAO chama a API externa: devolve um resultado "simulado" e o caminho real de
// entrega pro comercial e o WhatsApp (tela de sucesso) + e-mail de backup (PART 2).
// Por isso o log marca modo "stub" / status "simulado": nada foi pro CRM ainda.

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
  | { status: 'entregue'; modo: 'real'; crmId: string }
  | { status: 'falhou'; modo: 'real'; erro: string }

// Mapeamento recomendado no doc (secao 4.6): o orcamento do site vira um LEAD, com
// os itens do carrinho serializados num campo de observacao (menos acoplado, nao
// exige casar IDs de produto com o catalogo do Leads2b). Deixo pronto pra PART 1.
export function observacaoDoLead(lead: LeadOrcamento): string {
  const linhas = lead.itens.map(
    (i) => `- ${i.nome}${i.cor ? ` (cor: ${i.cor})` : ''}: ${i.quantidade} un`,
  )
  return [
    `Orcamento pelo site (${lead.total} un no total).`,
    `Empresa: ${lead.solicitante.empresa}`,
    'Itens:',
    ...linhas,
  ].join('\n')
}

// Entrega o lead ao CRM. Enquanto nao houver token + endpoint confirmados, roda em
// STUB (sem rede, resultado "simulado"). A assinatura ja esta pronta pra PART 1:
// trocar o corpo por um POST autenticado em api.leads2b.com criando o lead e
// devolvendo { status: 'entregue', modo: 'real', crmId }.
export async function entregarLead(_lead: LeadOrcamento): Promise<ResultadoEntrega> {
  const token = process.env.LEADS2B_TOKEN

  if (!token) {
    // PART 0: sem token, modo stub. Nada vai pro CRM; e so o caminho simulado.
    return { status: 'simulado', modo: 'stub', crmId: null }
  }

  // PART 1 (pendente): com token, implementar o POST real de criar lead aqui
  // (Authorization: Bearer <token>, base api.leads2b.com). Ate confirmar o
  // caminho/campos exatos (docs/integracao-leads2b.md secao 2), segue em stub pra
  // nao prometer uma entrega que ainda nao acontece.
  return { status: 'simulado', modo: 'stub', crmId: null }
}
