import { mediaID } from '../friendly/model'
import { RequestError } from '../friendly/api-errors'
import type { CategoriaDraft, CategoriaIssue } from './categoria-model'
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
