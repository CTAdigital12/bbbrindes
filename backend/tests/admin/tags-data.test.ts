import { describe, it, expect } from 'vitest'
import { copyTag, newTag, ordenarTags, tagBody, tagSaveIssue, validateTag } from '../../src/admin/tags/tags-data'
import { RequestError } from '../../src/admin/friendly/api-errors'
import type { TagDraft } from '../../src/admin/tags/tags-model'
const original: TagDraft = { id: 4, nome: 'Sustentabilidade', slug: 'sustentabilidade', updatedAt: '2026-10-01T00:00:00.000Z' }
describe('gravacao da tag', () => {
  it('envia apenas o nome alterado', () => {
    expect(tagBody({ ...original, nome: 'Eco' }, original)).toEqual({ nome: 'Eco' })
  })
  it('nao envia nada quando igual, nem o slug (protegido)', () => {
    expect(tagBody(original, original)).toEqual({})
    expect(tagBody({ ...original, nome: 'Eco' }, original)).not.toHaveProperty('slug')
    expect(tagBody({ ...original, slug: 'outro' }, original)).toEqual({})
  })
})
describe('duplicacao e novo', () => {
  it('a copia nasce sem id e sem slug, com sufixo', () => {
    const copy = copyTag(original)
    expect(copy.id).toBeUndefined(); expect(copy.slug).toBeUndefined()
    expect(copy.nome).toBe('Sustentabilidade (copia)')
  })
  it('nova tag comeca com nome vazio', () => {
    expect(newTag().nome).toBe('')
  })
})
describe('validacao e erro', () => {
  it('cobra o nome', () => {
    expect(validateTag(original)).toBeUndefined()
    expect(validateTag({ ...original, nome: ' ' })?.field).toBe('bb-tag-nome')
  })
  it('traduz erro de nome repetido (slug unico) apontando para o nome', () => {
    const issue = tagSaveIssue(new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path: 'slug', message: 'duplicado' }] } }] }))
    expect(issue.field).toBe('bb-tag-nome'); expect(issue.message).toMatch(/Ja existe/)
  })
  it('traduz erro de validacao do nome', () => {
    const issue = tagSaveIssue(new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path: 'nome', message: 'obrig' }] } }] }))
    expect(issue.field).toBe('bb-tag-nome')
  })
})
describe('ordenacao', () => {
  it('ordena por nome em pt-BR', () => {
    const rows: TagDraft[] = [{ id: 1, nome: 'Ética' }, { id: 2, nome: 'Awards' }, { id: 3, nome: 'brindes' }]
    expect(ordenarTags(rows).map(r => r.nome)).toEqual(['Awards', 'brindes', 'Ética'])
  })
})
