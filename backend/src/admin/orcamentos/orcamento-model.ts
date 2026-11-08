// Tipos do log de entrega dos orcamentos (collection logs-entrega). Somente leitura:
// a collection bloqueia create/update; o registro nasce pelo endpoint /api/orcamento.
// PII mascarada (LGPD): email parcial e telefone so com os ultimos digitos.
export type OrcamentoStatus = 'simulado' | 'entregue' | 'falhou' | 'reenviado'
export type OrcamentoModo = 'stub' | 'real'
export type OrcamentoRow = {
  id: number; requisicaoId: string; status: OrcamentoStatus; modo: OrcamentoModo
  crmId?: string | null; empresa?: string | null; emailMascarado?: string | null; telefoneMascarado?: string | null
  qtdItens?: number | null; totalUnidades?: number | null; consentimento?: boolean | null; erro?: string | null
  createdAt: string
}
export const ORCAMENTO_PATH = '/admin/collections/logs-entrega'
