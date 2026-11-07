import { mediaID } from '../friendly/model'
import { RequestError } from '../friendly/api-errors'
import { grupoRank } from './categoria-model'
import type { CategoriaDraft, CategoriaIssue, CategoriaRow } from './categoria-model'
const fields = ['nome', 'grupo', 'ordem', 'icone'] as const
export function newCategoria(): CategoriaDraft {
  return { nome: '', grupo: 'geral', ordem: 0 }
}
export function copyCategoria(c: CategoriaDraft): CategoriaDraft {
  return { ...c, id: undefined, slug: undefined, nome: `${c.nome} (cópia)`, updatedAt: undefined }
}
// PATCH parcial: so os campos alterados. slug fica protegido (gerado do nome).
// icone vira id da Media; ordem vira numero (campo aceita texto na tela).
export function categoriaBody(c: CategoriaDraft, original?: CategoriaDraft): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  for (const field of fields) {
    if (c[field] !== undefined && (!original || JSON.stringify(c[field]) !== JSON.stringify(original[field]))) body[field] = c[field]
  }
  if ('icone' in body) body.icone = mediaID(c.icone) ?? null
  if ('ordem' in body) body.ordem = Number.isFinite(Number(c.ordem)) ? Number(c.ordem) : 0
  return body
}
export function validateCategoria(c: CategoriaDraft): CategoriaIssue | undefined {
  if (!c.nome.trim()) return { message: 'Preencha o nome da categoria.', field: 'bb-cat-nome' }
  return undefined
}
export function catSaveIssue(cause: unknown): CategoriaIssue {
  if (cause instanceof RequestError) {
    if (cause.fields.some(f => f.path === 'nome')) return { message: 'Confira o nome da categoria.', field: 'bb-cat-nome' }
    if (cause.fields.length) return { message: 'Confira os campos e tente salvar novamente.' }
  }
  return { message: cause instanceof Error ? cause.message : 'Não foi possível salvar a categoria. Tente novamente.' }
}
export type OrdemChange = { id: number; ordem: number }
// Ordena como o site enxerga depois: ecologicos primeiro (ordem baixa), depois geral;
// dentro do grupo por ordem e nome. O site ordena so por `ordem`, entao manter os
// ecologicos com a ordem menor preserva o "ecologicos no topo".
export function ordenarCategorias(rows: CategoriaRow[]): CategoriaRow[] {
  return [...rows].sort((a, b) =>
    grupoRank(a.grupo) - grupoRank(b.grupo) ||
    (a.ordem ?? 0) - (b.ordem ?? 0) ||
    a.nome.localeCompare(b.nome, 'pt-BR'))
}
// Move a categoria `id` uma posicao para cima/baixo DENTRO do seu grupo (nao cruza a
// fronteira ecologicos/geral). Renumera a `ordem` global (0..n-1, ecologicos primeiro)
// e devolve so as linhas cuja ordem mudou. Ponta do grupo -> changes vazio (no-op).
export function moverCategoria(rows: CategoriaRow[], id: number, dir: 'up' | 'down'): { rows: CategoriaRow[]; changes: OrdemChange[] } {
  const ordered = ordenarCategorias(rows)
  const i = ordered.findIndex(r => r.id === id)
  if (i < 0) return { rows, changes: [] }
  const j = dir === 'up' ? i - 1 : i + 1
  if (j < 0 || j >= ordered.length || grupoRank(ordered[j].grupo) !== grupoRank(ordered[i].grupo)) return { rows, changes: [] }
  const swapped = ordered.slice()
  ;[swapped[i], swapped[j]] = [swapped[j], swapped[i]]
  const changes: OrdemChange[] = []
  const nextOrdem = new Map<number, number>()
  swapped.forEach((row, index) => { nextOrdem.set(row.id, index); if ((row.ordem ?? 0) !== index) changes.push({ id: row.id, ordem: index }) })
  const updated = rows.map(row => nextOrdem.has(row.id) ? { ...row, ordem: nextOrdem.get(row.id)! } : row)
  return { rows: updated, changes }
}
