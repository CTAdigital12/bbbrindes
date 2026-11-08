import { describe, it, expect } from 'vitest'
import { copyPost, newPost, postBody, postSaveIssue, tagIDs, validatePost } from '../../src/admin/posts/post-data'
import { dateShort, tagLabel, toDateInput } from '../../src/admin/posts/post-model'
import { RequestError } from '../../src/admin/friendly/api-errors'
import type { PostDraft } from '../../src/admin/posts/post-model'
const original: PostDraft = {
  id: 2, titulo: 'Como escolher brindes', slug: 'como-escolher-brindes', resumo: 'Guia rápido',
  data: '2026-10-01T00:00:00.000Z', autor: 'Equipe BB', capa: { id: 50, url: 'https://m.test/50.webp' },
  conteudo: { root: { children: [] } }, tags: [{ id: 7, nome: 'Eco' }, 9], updatedAt: '2026-10-01T00:00:00.000Z',
}
describe('gravacao do post', () => {
  it('envia apenas o campo alterado', () => {
    expect(postBody({ ...original, autor: 'Nova pessoa' }, original)).toEqual({ autor: 'Nova pessoa' })
  })
  it('nao envia slug (protegido) nem nada quando igual', () => {
    expect(postBody(original, original)).toEqual({})
    expect(postBody({ ...original, titulo: 'Outro título' }, original)).not.toHaveProperty('slug')
  })
  it('normaliza capa para id e tags para ids', () => {
    const body = postBody({ ...original, capa: { id: 90 }, tags: [{ id: 1, nome: 'A' }, 2] }, original)
    expect(body.capa).toBe(90); expect(body.tags).toEqual([1, 2])
    expect(postBody({ ...original, capa: null }, original).capa).toBe(null)
  })
  it('extrai ids de tags (objeto ou numero)', () => {
    expect(tagIDs(original)).toEqual([7, 9])
  })
})
describe('duplicacao e novo', () => {
  it('a copia nasce sem id e sem slug, com sufixo', () => {
    const copy = copyPost(original)
    expect(copy.id).toBeUndefined(); expect(copy.slug).toBeUndefined()
    expect(copy.titulo).toBe('Como escolher brindes (cópia)')
  })
  it('novo post nasce com data de hoje e sem tags', () => {
    const novo = newPost()
    expect(novo.data).toMatch(/^\d{4}-\d{2}-\d{2}$/); expect(novo.tags).toEqual([]); expect(novo.titulo).toBe('')
  })
})
describe('validacao, datas e erro', () => {
  it('cobra titulo e data', () => {
    expect(validatePost(original)).toBeUndefined()
    expect(validatePost({ ...original, titulo: ' ' })?.field).toBe('bb-post-titulo')
    expect(validatePost({ ...original, data: '' })?.field).toBe('bb-post-data')
  })
  it('formata a data para o input e para a lista', () => {
    expect(toDateInput('2026-10-01T00:00:00.000Z')).toBe('2026-10-01')
    expect(toDateInput(null)).toBe('')
    expect(dateShort('2026-10-01T00:00:00.000Z')).toBe('01/10/2026')
    expect(dateShort(undefined)).toBe('-')
  })
  it('rotula a tag (objeto ou numero)', () => {
    expect(tagLabel({ id: 7, nome: 'Eco' })).toBe('Eco')
    expect(tagLabel(9)).toBe('#9')
  })
  it('traduz erro do servidor', () => {
    const issue = postSaveIssue(new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path: 'data', message: 'obrig' }] } }] }))
    expect(issue.field).toBe('bb-post-data')
  })
})
