import { mediaID } from '../friendly/model'
import { RequestError } from '../friendly/api-errors'
import type { CaseDraft, CaseIssue, Tag } from './cases-model'
const fields = ['cliente', 'titulo', 'segmento', 'resumo', 'logo', 'imagem', 'depoimento', 'tags'] as const
// Tags atuais (ids) pra preservar a relacao na gravacao; e as tags "expandidas"
// (depth:1) pra exibir como chips. Nao montamos seletor novo (fica pra depois).
export const tagIDs = (c: CaseDraft) => (c.tags ?? []).map(t => (typeof t === 'number' ? t : t.id)).filter((id): id is number => typeof id === 'number')
export const caseTags = (c: CaseDraft): Tag[] => (c.tags ?? []).filter((t): t is Tag => typeof t === 'object' && t !== null)
export function newCase(): CaseDraft {
  return { cliente: '', titulo: '', segmento: '', resumo: '', depoimento: { texto: '', autor: '' }, tags: [] }
}
export function copyCase(c: CaseDraft): CaseDraft {
  return { ...c, id: undefined, slug: undefined, titulo: `${c.titulo} (cópia)`, updatedAt: undefined }
}
// PATCH parcial: so os campos alterados. slug fica protegido (gerado do titulo).
// logo/imagem viram id da Media; tags viram ids (preserva a selecao atual).
export function caseBody(c: CaseDraft, original?: CaseDraft): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  for (const field of fields) {
    if (c[field] !== undefined && (!original || JSON.stringify(c[field]) !== JSON.stringify(original[field]))) body[field] = c[field]
  }
  if ('logo' in body) body.logo = mediaID(c.logo) ?? null
  if ('imagem' in body) body.imagem = mediaID(c.imagem) ?? null
  if ('tags' in body) body.tags = tagIDs(c)
  return body
}
export function validateCase(c: CaseDraft): CaseIssue | undefined {
  if (!c.cliente.trim()) return { message: 'Preencha o cliente do case.', field: 'bb-cases-cliente' }
  if (!c.titulo.trim()) return { message: 'Preencha o título do case.', field: 'bb-cases-titulo' }
  return undefined
}
export function caseSaveIssue(cause: unknown): CaseIssue {
  if (cause instanceof RequestError) {
    if (cause.fields.some(f => f.path === 'cliente')) return { message: 'Confira o cliente do case.', field: 'bb-cases-cliente' }
    if (cause.fields.some(f => f.path === 'titulo')) return { message: 'Confira o título do case.', field: 'bb-cases-titulo' }
    if (cause.fields.length) return { message: 'Confira os campos e tente salvar novamente.' }
  }
  return { message: cause instanceof Error ? cause.message : 'Não foi possível salvar o case. Tente novamente.' }
}
