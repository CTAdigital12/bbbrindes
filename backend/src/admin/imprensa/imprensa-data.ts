import { RequestError } from '../friendly/api-errors'
import type { ImprensaDraft, ImprensaIssue, Tag } from './imprensa-model'
const fields = ['titulo', 'veiculo', 'data', 'resumo', 'url', 'tags'] as const
export const tagIDs = (m: ImprensaDraft) => (m.tags ?? []).map(t => (typeof t === 'number' ? t : t.id)).filter((id): id is number => typeof id === 'number')
export const materiaTags = (m: ImprensaDraft): Tag[] => (m.tags ?? []).filter((t): t is Tag => typeof t === 'object' && t !== null)
// Campo date: no input e "AAAA-MM-DD"; no banco e ISO. Usa os componentes UTC
// pra nao deslocar o dia por fuso. Guardamos o valor cru do input no estado e so
// normalizamos para ISO na gravacao (dateISO).
export function dateInputValue(value?: string | null): string {
  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return typeof value === 'string' ? value.slice(0, 10) : ''
  const year = parsed.getUTCFullYear()
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0')
  const day = String(parsed.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
export function dateISO(value?: string | null): string | null {
  const only = dateInputValue(value)
  if (!only) return null
  const parsed = new Date(`${only}T00:00:00.000Z`)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}
export function dateLabelBR(value?: string | null): string {
  const only = dateInputValue(value)
  if (!only) return 'Sem data'
  const [year, month, day] = only.split('-')
  return `${day}/${month}/${year}`
}
export function newImprensa(): ImprensaDraft {
  return { titulo: '', veiculo: '', data: '', resumo: '', url: '', tags: [] }
}
export function copyImprensa(m: ImprensaDraft): ImprensaDraft {
  return { ...m, id: undefined, titulo: `${m.titulo} (cópia)`, updatedAt: undefined }
}
// PATCH parcial: so os campos alterados. data vira ISO; tags viram ids (preserva
// a selecao atual). Sem slug nesta collection.
export function imprensaBody(m: ImprensaDraft, original?: ImprensaDraft): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  for (const field of fields) {
    if (m[field] !== undefined && (!original || JSON.stringify(m[field]) !== JSON.stringify(original[field]))) body[field] = m[field]
  }
  if ('data' in body) body.data = dateISO(m.data)
  if ('tags' in body) body.tags = tagIDs(m)
  return body
}
export function validateImprensa(m: ImprensaDraft): ImprensaIssue | undefined {
  if (!m.titulo.trim()) return { message: 'Preencha o título da matéria.', field: 'bb-imp-titulo' }
  if (!m.veiculo.trim()) return { message: 'Preencha o veículo da matéria.', field: 'bb-imp-veiculo' }
  if (!dateInputValue(m.data)) return { message: 'Informe a data da matéria.', field: 'bb-imp-data' }
  return undefined
}
export function imprensaSaveIssue(cause: unknown): ImprensaIssue {
  if (cause instanceof RequestError) {
    if (cause.fields.some(f => f.path === 'titulo')) return { message: 'Confira o título da matéria.', field: 'bb-imp-titulo' }
    if (cause.fields.some(f => f.path === 'veiculo')) return { message: 'Confira o veículo da matéria.', field: 'bb-imp-veiculo' }
    if (cause.fields.some(f => f.path === 'data')) return { message: 'Confira a data da matéria.', field: 'bb-imp-data' }
    if (cause.fields.length) return { message: 'Confira os campos e tente salvar novamente.' }
  }
  return { message: cause instanceof Error ? cause.message : 'Não foi possível salvar a matéria. Tente novamente.' }
}
