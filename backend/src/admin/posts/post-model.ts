import type { MediaRef } from '../friendly/model'
// Tipos da collection `posts` (menu "Blog"). Espelham Posts.ts e o leitor do front
// (content.ts getPosts). slug e gerado do titulo (bloqueado); capa e upload (Media);
// conteudo e richText (lexical) editado como texto; tags e relacao (exibida em chips).
export type Tag = { id: number; nome?: string; slug?: string }
export type PostDraft = {
  id?: number; titulo: string; slug?: string; resumo?: string; data?: string | null;
  autor?: string; capa?: MediaRef; conteudo?: unknown; tags?: (Tag | number)[]; updatedAt?: string
}
export type PostRow = PostDraft & { id: number }
export type PostIssue = { message: string; field?: string }
export const POST_PATH = '/admin/collections/posts'
// Nome visivel de uma tag (relacao com depth>=1 vem como objeto; senao e so o id).
export const tagLabel = (tag: Tag | number): string =>
  typeof tag === 'number' ? `#${tag}` : (tag.nome || tag.slug || `#${tag.id}`)
// 'YYYY-MM-DD' pro input date, a partir do ISO guardado (ou vazio).
export const toDateInput = (value?: string | null): string =>
  value ? new Date(value).toISOString().slice(0, 10) : ''
// Rotulo curto da data pra lista e previa (pt-BR), ou traco quando vazio.
export const dateShort = (value?: string | null): string =>
  value ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC', dateStyle: 'short' }).format(new Date(value)) : '-'
