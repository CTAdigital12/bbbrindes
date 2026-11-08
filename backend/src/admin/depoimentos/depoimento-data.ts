import { mediaID } from '../friendly/model'
import { RequestError } from '../friendly/api-errors'
import type { DepoimentoDraft, DepoimentoIssue, DepoimentoRow } from './depoimento-model'
const fields = ['texto', 'autor', 'empresa', 'foto', 'ordem', 'ativo'] as const
export const activeDepoimento = (d: DepoimentoDraft) => d.ativo !== false
export const depStatus = (d: DepoimentoDraft): [key: 'ok' | 'off', label: string] => activeDepoimento(d) ? ['ok', 'No ar'] : ['off', 'Inativo']
export function newDepoimento(): DepoimentoDraft {
  return { texto: '', autor: '', empresa: '', ordem: 0, ativo: true }
}
export function copyDepoimento(d: DepoimentoDraft): DepoimentoDraft {
  return { ...d, id: undefined, autor: `${d.autor} (cópia)`, ativo: false, updatedAt: undefined }
}
// PATCH parcial: so os campos alterados. foto vira id da Media; ordem vira numero
// (o campo aceita texto na tela). Depoimentos nao tem slug.
export function depoimentoBody(d: DepoimentoDraft, original?: DepoimentoDraft): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  for (const field of fields) {
    if (d[field] !== undefined && (!original || JSON.stringify(d[field]) !== JSON.stringify(original[field]))) body[field] = d[field]
  }
  if ('foto' in body) body.foto = mediaID(d.foto) ?? null
  if ('ordem' in body) body.ordem = Number.isFinite(Number(d.ordem)) ? Number(d.ordem) : 0
  return body
}
export function validateDepoimento(d: DepoimentoDraft): DepoimentoIssue | undefined {
  if (!d.texto.trim()) return { message: 'Escreva o depoimento.', field: 'bb-dep-texto' }
  if (!d.autor.trim()) return { message: 'Informe o autor do depoimento.', field: 'bb-dep-autor' }
  return undefined
}
export function depSaveIssue(cause: unknown): DepoimentoIssue {
  if (cause instanceof RequestError) {
    if (cause.fields.some(f => f.path === 'texto')) return { message: 'Confira o texto do depoimento.', field: 'bb-dep-texto' }
    if (cause.fields.some(f => f.path === 'autor')) return { message: 'Confira o autor do depoimento.', field: 'bb-dep-autor' }
    if (cause.fields.length) return { message: 'Confira os campos e tente salvar novamente.' }
  }
  return { message: cause instanceof Error ? cause.message : 'Não foi possível salvar o depoimento. Tente novamente.' }
}
export type OrdemChange = { id: number; ordem: number }
// Ordena por `ordem` (menor primeiro); empate pelo autor. O site mostra nessa ordem.
export function ordenarDepoimentos(rows: DepoimentoRow[]): DepoimentoRow[] {
  return [...rows].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0) || a.autor.localeCompare(b.autor, 'pt-BR'))
}
// Move o depoimento `id` uma posicao para cima/baixo (lista unica). Renumera a
// `ordem` (0..n-1) e devolve so as linhas cuja ordem mudou. Ponta da lista -> no-op.
export function moverDepoimento(rows: DepoimentoRow[], id: number, dir: 'up' | 'down'): { rows: DepoimentoRow[]; changes: OrdemChange[] } {
  const ordered = ordenarDepoimentos(rows)
  const i = ordered.findIndex(r => r.id === id)
  if (i < 0) return { rows, changes: [] }
  const j = dir === 'up' ? i - 1 : i + 1
  if (j < 0 || j >= ordered.length) return { rows, changes: [] }
  const swapped = ordered.slice()
  ;[swapped[i], swapped[j]] = [swapped[j], swapped[i]]
  const changes: OrdemChange[] = []
  const nextOrdem = new Map<number, number>()
  swapped.forEach((row, index) => { nextOrdem.set(row.id, index); if ((row.ordem ?? 0) !== index) changes.push({ id: row.id, ordem: index }) })
  const updated = rows.map(row => nextOrdem.has(row.id) ? { ...row, ordem: nextOrdem.get(row.id)! } : row)
  return { rows: updated, changes }
}
