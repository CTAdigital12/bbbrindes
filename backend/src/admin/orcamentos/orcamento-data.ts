import type { OrcamentoModo, OrcamentoRow, OrcamentoStatus } from './orcamento-model'
// Rotulo e cor (badge) de cada status/modo, para a caixa de entrada.
const STATUS: Record<OrcamentoStatus, { label: string; key: 'ok' | 'off' | 'warn' | 'info' }> = {
  simulado: { label: 'Simulado', key: 'warn' },
  entregue: { label: 'Entregue ao CRM', key: 'ok' },
  falhou: { label: 'Falhou', key: 'off' },
  reenviado: { label: 'Reenviado', key: 'info' },
}
export const statusLabel = (s: OrcamentoStatus) => STATUS[s]?.label ?? s
export const statusKey = (s: OrcamentoStatus) => STATUS[s]?.key ?? 'info'
export const modoLabel = (m: OrcamentoModo) => (m === 'real' ? 'Real (via n8n)' : 'Stub (sem CRM)')
export const STATUS_FILTERS: { value: 'todos' | OrcamentoStatus; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'simulado', label: 'Simulado' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'falhou', label: 'Falhou' },
  { value: 'reenviado', label: 'Reenviado' },
]
// Data e hora curtas no fuso de Sao Paulo.
export function dataHora(value?: string): string {
  if (!value) return ''
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
}
// Contato mascarado resumido para a lista (email ou telefone, o que houver).
export function contatoMascarado(row: Pick<OrcamentoRow, 'emailMascarado' | 'telefoneMascarado'>): string {
  return [row.emailMascarado, row.telefoneMascarado].filter(Boolean).join('  ·  ') || '-'
}
export const matchStatus = (filtro: 'todos' | OrcamentoStatus) => (row: OrcamentoRow) => filtro === 'todos' || row.status === filtro
