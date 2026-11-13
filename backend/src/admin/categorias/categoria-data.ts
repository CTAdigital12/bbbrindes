import { mediaID } from '../friendly/model'
import { RequestError } from '../friendly/api-errors'
import { grupoRank } from './categoria-model'
import type { CategoriaDraft, CategoriaIssue, CategoriaRow, GrupoCategoria } from './categoria-model'
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

// === Item L: reordenar ARRASTANDO ===
// Move a categoria `draggedId` para a posicao da `targetId` (solta ANTES dela) e
// renumera a lista inteira (0..n-1, ecologicos primeiro). So reordena DENTRO do
// mesmo grupo: se o alvo for de outro grupo, nao faz nada (evita cruzar a fronteira
// ecologicos/geral, igual as setinhas). Devolve so as linhas cuja ordem mudou.
export function reordenarPorArrasto(rows: CategoriaRow[], draggedId: number, targetId: number): { rows: CategoriaRow[]; changes: OrdemChange[] } {
  if (draggedId === targetId) return { rows, changes: [] }
  const ordered = ordenarCategorias(rows)
  const from = ordered.findIndex(r => r.id === draggedId)
  const to = ordered.findIndex(r => r.id === targetId)
  if (from < 0 || to < 0) return { rows, changes: [] }
  if (grupoRank(ordered[from].grupo) !== grupoRank(ordered[to].grupo)) return { rows, changes: [] }
  const next = ordered.slice()
  const [moved] = next.splice(from, 1)
  const targetIdx = next.findIndex(r => r.id === targetId)
  // Arrastando pra BAIXO (from < to): solta DEPOIS do alvo. Pra cima: ANTES do alvo.
  // Sem isso, descer 1 posicao exigia soltar no item 2 abaixo (insere sempre antes).
  const insertAt = from < to ? targetIdx + 1 : targetIdx
  next.splice(insertAt, 0, moved)
  const changes: OrdemChange[] = []
  const nextOrdem = new Map<number, number>()
  next.forEach((row, index) => { nextOrdem.set(row.id, index); if ((row.ordem ?? 0) !== index) changes.push({ id: row.id, ordem: index }) })
  const updated = rows.map(row => nextOrdem.has(row.id) ? { ...row, ordem: nextOrdem.get(row.id)! } : row)
  return { rows: updated, changes }
}

// === Item K: conflito de ordem no editor ===
// Linha minima usada pra detectar/resolver conflito de posicao (lida da API).
export type OrdemSibling = { id?: number; nome: string; grupo?: GrupoCategoria | null; ordem?: number | null }
const porOrdemNome = (a: OrdemSibling, b: OrdemSibling) => (a.ordem ?? 0) - (b.ordem ?? 0) || a.nome.localeCompare(b.nome, 'pt-BR')
// A ordem e global (o site ordena so por `ordem`), entao ordem repetida em QUALQUER
// categoria e um conflito real (foi o que jogou a categoria "pro fim" quando varias
// ficaram em 0). Devolve a primeira categoria que ja usa essa ordem.
export function conflitoOrdem(todas: OrdemSibling[], ordem: number, selfId?: number): OrdemSibling | undefined {
  return todas.find(c => c.id !== selfId && (c.ordem ?? 0) === ordem)
}
// "Substituir": coloca a categoria na posicao desejada (dentro do seu grupo) e
// renumera tudo 0..n-1 sem duplicatas, mantendo os ecologicos no topo. `alvo` e a
// ordem global digitada; e encaixada na faixa valida do grupo da categoria.
export function resolverSubstituir(todas: OrdemSibling[], self: OrdemSibling, grupo: GrupoCategoria | null | undefined, alvo: number): { ordem: number; changes: OrdemChange[] } {
  const selfRank = grupoRank(grupo)
  const eco = todas.filter(c => c.id !== self.id && grupoRank(c.grupo) === 0).sort(porOrdemNome)
  const ger = todas.filter(c => c.id !== self.id && grupoRank(c.grupo) === 1).sort(porOrdemNome)
  const start = selfRank === 0 ? 0 : eco.length
  const grupoItens = selfRank === 0 ? eco : ger
  const idx = Math.max(0, Math.min(alvo - start, grupoItens.length))
  const item: OrdemSibling = { id: self.id, nome: self.nome, grupo, ordem: self.ordem }
  const arranged = [...grupoItens.slice(0, idx), item, ...grupoItens.slice(idx)]
  const full = selfRank === 0 ? [...arranged, ...ger] : [...eco, ...arranged]
  const changes: OrdemChange[] = []
  let ordem = start + idx
  full.forEach((row, i) => {
    if (row.id === self.id) { ordem = i; return }
    if ((row.ordem ?? 0) !== i) changes.push({ id: row.id!, ordem: i })
  })
  return { ordem, changes }
}
// "Mandar pro fim": maior ordem existente + 1 (fica unica, sem baguncar o resto).
export function ordemFim(todas: OrdemSibling[], selfId?: number): number {
  return todas.reduce((max, c) => (c.id === selfId ? max : Math.max(max, (c.ordem ?? 0) + 1)), 0)
}
