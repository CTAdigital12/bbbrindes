import { RequestError } from '../friendly/api-errors'
import type { Media } from '../friendly/model'
// Logica pura da biblioteca de Midia. A unica edicao amigavel e a descricao (alt),
// obrigatoria (SEO + leitor de tela). Upload e exclusao usam a API direto.
export type MidiaIssue = { message: string; field?: string }
export const MIDIA_PATH = '/admin/collections/media'
// PATCH parcial: so manda alt quando mudou.
export function altBody(alt: string, original?: string): Record<string, unknown> {
  const next = alt.trim()
  if (original !== undefined && next === (original ?? '').trim()) return {}
  return { alt: next }
}
export function validateAlt(alt: string): MidiaIssue | undefined {
  if (!alt.trim()) return { message: 'Escreva uma descricao da imagem.', field: 'bb-midia-alt' }
  return undefined
}
export function altSaveIssue(cause: unknown): MidiaIssue {
  if (cause instanceof RequestError) {
    if (cause.fields.some(f => f.path === 'alt')) return { message: 'Confira a descricao da imagem.', field: 'bb-midia-alt' }
    if (cause.fields.length) return { message: 'Confira os campos e tente salvar novamente.' }
  }
  return { message: cause instanceof Error ? cause.message : 'Nao foi possivel salvar a descricao. Tente novamente.' }
}
// Legenda curta do tamanho do arquivo, quando a API traz filesize (bytes).
export function fileSizeLabel(media: Pick<Media, 'filename'> & { filesize?: number | null }): string {
  const bytes = media.filesize
  if (!bytes || bytes <= 0) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
export const semDescricao = (media: Pick<Media, 'alt'>) => !media.alt || !String(media.alt).trim()
