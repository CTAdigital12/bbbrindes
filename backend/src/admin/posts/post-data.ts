import { mediaID } from '../friendly/model'
import { RequestError } from '../friendly/api-errors'
import type { PostDraft, PostIssue } from './post-model'
const fields = ['titulo', 'resumo', 'data', 'autor', 'capa', 'conteudo', 'tags'] as const
// ids das tags marcadas (preserva a selecao; relacao vem como objeto ou numero).
export const tagIDs = (p: PostDraft): number[] =>
  (p.tags ?? []).map(t => (typeof t === 'number' ? t : t.id)).filter((id): id is number => typeof id === 'number')
export function newPost(): PostDraft {
  return { titulo: '', resumo: '', data: new Date().toISOString().slice(0, 10), autor: '', tags: [] }
}
export function copyPost(p: PostDraft): PostDraft {
  return { ...p, id: undefined, slug: undefined, titulo: `${p.titulo} (cópia)`, updatedAt: undefined }
}
// PATCH parcial: so os campos alterados. slug fica protegido (gerado do titulo).
// capa vira id da Media; tags viram ids (preserva a selecao atual).
export function postBody(p: PostDraft, original?: PostDraft): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  for (const field of fields) {
    if (p[field] !== undefined && (!original || JSON.stringify(p[field]) !== JSON.stringify(original[field]))) body[field] = p[field]
  }
  if ('capa' in body) body.capa = mediaID(p.capa) ?? null
  if ('tags' in body) body.tags = tagIDs(p)
  return body
}
export function validatePost(p: PostDraft): PostIssue | undefined {
  if (!p.titulo.trim()) return { message: 'Preencha o título do post.', field: 'bb-post-titulo' }
  if (!p.data) return { message: 'Escolha a data do post.', field: 'bb-post-data' }
  return undefined
}
export function postSaveIssue(cause: unknown): PostIssue {
  if (cause instanceof RequestError) {
    if (cause.fields.some(f => f.path === 'titulo')) return { message: 'Confira o título do post.', field: 'bb-post-titulo' }
    if (cause.fields.some(f => f.path === 'data')) return { message: 'Confira a data do post.', field: 'bb-post-data' }
    if (cause.fields.length) return { message: 'Confira os campos e tente salvar novamente.' }
  }
  return { message: cause instanceof Error ? cause.message : 'Não foi possível salvar o post. Tente novamente.' }
}
