import { RequestError } from '../friendly/api-errors'
import type { TagDraft, TagIssue } from './tags-model'
// So o campo `nome` e editavel: o slug e gerado do nome no servidor (hook) e fica
// protegido (nao enviamos slug). PATCH parcial, igual ao padrao das categorias.
const fields = ['nome'] as const
export function newTag(): TagDraft {
  return { nome: '' }
}
// A copia nasce sem id e sem slug, com sufixo no nome (o servidor gera o novo slug).
export function copyTag(t: TagDraft): TagDraft {
  return { ...t, id: undefined, slug: undefined, nome: `${t.nome} (copia)`, updatedAt: undefined }
}
export function tagBody(t: TagDraft, original?: TagDraft): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  for (const field of fields) {
    if (t[field] !== undefined && (!original || JSON.stringify(t[field]) !== JSON.stringify(original[field]))) body[field] = t[field]
  }
  return body
}
export function validateTag(t: TagDraft): TagIssue | undefined {
  if (!t.nome.trim()) return { message: 'Preencha o nome da tag.', field: 'bb-tag-nome' }
  return undefined
}
// Traduz o erro do servidor. O slug e unico: nome que gera slug ja existente volta
// como erro de validacao em `slug` (ou `nome`), entao avisamos sobre o nome repetido.
export function tagSaveIssue(cause: unknown): TagIssue {
  if (cause instanceof RequestError) {
    if (cause.fields.some(f => f.path === 'slug')) return { message: 'Ja existe uma tag com esse nome. Escolha outro.', field: 'bb-tag-nome' }
    if (cause.fields.some(f => f.path === 'nome')) return { message: 'Confira o nome da tag.', field: 'bb-tag-nome' }
    if (cause.fields.length) return { message: 'Confira os campos e tente salvar novamente.' }
  }
  return { message: cause instanceof Error ? cause.message : 'Nao foi possivel salvar a tag. Tente novamente.' }
}
// Ordena por nome (pt-BR), como a lista enxerga depois.
export function ordenarTags<T extends { nome: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
}
