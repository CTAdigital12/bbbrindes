import { mediaID } from '../friendly/model'
import { RequestError } from '../friendly/api-errors'
import type { CampanhaDraft, CampanhaIssue } from './campanha-model'
const fields = ['nome', 'mes', 'chamada', 'imagem', 'conteudo', 'produtos', 'ativo'] as const
export const activeCampanha = (c: CampanhaDraft) => c.ativo !== false
export const campStatus = (c: CampanhaDraft): [key: 'ok' | 'off', label: string] => activeCampanha(c) ? ['ok', 'No ar'] : ['off', 'Inativo']
export const produtoIDs = (c: CampanhaDraft) => (c.produtos ?? []).map(p => (typeof p === 'number' ? p : p.id)).filter((id): id is number => typeof id === 'number')
export function newCampanha(): CampanhaDraft {
  return { nome: '', mes: '', chamada: '', ativo: false, produtos: [] }
}
export function copyCampanha(c: CampanhaDraft): CampanhaDraft {
  return { ...c, id: undefined, slug: undefined, nome: `${c.nome} (cópia)`, ativo: false, updatedAt: undefined }
}
// PATCH parcial: so os campos alterados. slug fica protegido (gerado do nome).
// imagem vira id da Media; produtos viram ids, preservando a selecao atual.
export function campanhaBody(c: CampanhaDraft, original?: CampanhaDraft): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  for (const field of fields) {
    if (c[field] !== undefined && (!original || JSON.stringify(c[field]) !== JSON.stringify(original[field]))) body[field] = c[field]
  }
  if ('imagem' in body) body.imagem = mediaID(c.imagem) ?? null
  if ('produtos' in body) body.produtos = produtoIDs(c)
  return body
}
export function validateCampanha(c: CampanhaDraft): CampanhaIssue | undefined {
  if (!c.nome.trim()) return { message: 'Preencha o nome da campanha.', field: 'bb-camp-nome' }
  return undefined
}
export function campSaveIssue(cause: unknown): CampanhaIssue {
  if (cause instanceof RequestError) {
    if (cause.fields.some(f => f.path === 'nome')) return { message: 'Confira o nome da campanha.', field: 'bb-camp-nome' }
    if (cause.fields.length) return { message: 'Confira os campos e tente salvar novamente.' }
  }
  return { message: cause instanceof Error ? cause.message : 'Não foi possível salvar a campanha. Tente novamente.' }
}
