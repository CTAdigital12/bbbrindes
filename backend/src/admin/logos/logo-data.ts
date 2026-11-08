import { RequestError } from '../friendly/api-errors'
import type { LogoDraft, LogoIssue, LogoRow } from './logo-model'
const fields = ['nome', 'ordem'] as const
export function newLogo(): LogoDraft {
  return { nome: '', ordem: 0 }
}
// PATCH parcial dos campos de texto (nome/ordem). O arquivo e enviado a parte
// (multipart), porque logos e uma colecao de upload. ordem vira numero.
export function logoBody(l: LogoDraft, original?: LogoDraft): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  for (const field of fields) {
    if (l[field] !== undefined && (!original || JSON.stringify(l[field]) !== JSON.stringify(original[field]))) body[field] = l[field]
  }
  if ('ordem' in body) body.ordem = Number.isFinite(Number(l.ordem)) ? Number(l.ordem) : 0
  return body
}
// temArquivo = ja existe arquivo salvo OU um novo foi escolhido. Logo novo exige arquivo.
export function validateLogo(l: LogoDraft, temArquivo: boolean): LogoIssue | undefined {
  if (!l.nome.trim()) return { message: 'Informe o nome da marca.', field: 'bb-logo-nome' }
  if (!temArquivo) return { message: 'Envie o arquivo do logo (SVG ou PNG).', field: 'bb-logo-file' }
  return undefined
}
export function logoSaveIssue(cause: unknown): LogoIssue {
  if (cause instanceof RequestError) {
    if (cause.fields.some(f => f.path === 'nome')) return { message: 'Confira o nome da marca.', field: 'bb-logo-nome' }
    if (cause.fields.some(f => f.path === 'file')) return { message: 'Confira o arquivo do logo.', field: 'bb-logo-file' }
    if (cause.fields.length) return { message: 'Confira os campos e tente salvar novamente.' }
  }
  return { message: cause instanceof Error ? cause.message : 'Não foi possível salvar o logo. Tente novamente.' }
}
export type OrdemChange = { id: number; ordem: number }
// Ordena por `ordem` (menor primeiro); empate pelo nome. O marquee segue essa ordem.
export function ordenarLogos(rows: LogoRow[]): LogoRow[] {
  return [...rows].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0) || a.nome.localeCompare(b.nome, 'pt-BR'))
}
// Move o logo `id` uma posicao para cima/baixo (lista unica). Renumera a `ordem`
// (0..n-1) e devolve so as linhas cuja ordem mudou. Ponta da lista -> no-op.
export function moverLogo(rows: LogoRow[], id: number, dir: 'up' | 'down'): { rows: LogoRow[]; changes: OrdemChange[] } {
  const ordered = ordenarLogos(rows)
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
