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
// Troca de arquivo: so imagem, ate 15 MB (mesmo limite do upload de imagem nova).
export const MIDIA_ACCEPT = 'image/*'
export const MIDIA_MAX_BYTES = 15 * 1024 * 1024
export function validateReplaceFile(file: File | null): MidiaIssue | undefined {
  if (!file) return { message: 'Escolha a nova imagem.', field: 'bb-midia-file' }
  if (!file.type.startsWith('image/')) return { message: 'Escolha um arquivo de imagem.', field: 'bb-midia-file' }
  if (file.size > MIDIA_MAX_BYTES) return { message: 'A imagem deve ter ate 15 MB.', field: 'bb-midia-file' }
  return undefined
}
export function replaceSaveIssue(cause: unknown): MidiaIssue {
  if (cause instanceof RequestError) {
    if (cause.fields.some(f => f.path === 'file')) return { message: 'Confira o arquivo da imagem.', field: 'bb-midia-file' }
    if (cause.fields.length) return { message: 'Confira os campos e tente trocar novamente.' }
  }
  return { message: cause instanceof Error ? cause.message : 'Nao foi possivel trocar o arquivo. Tente novamente.' }
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
