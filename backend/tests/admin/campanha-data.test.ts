import { describe, it, expect } from 'vitest'
import { campanhaBody, campSaveIssue, campStatus, copyCampanha, newCampanha, produtoIDs, validateCampanha } from '../../src/admin/campanhas/campanha-data'
import { RequestError } from '../../src/admin/friendly/api-errors'
import type { CampanhaDraft } from '../../src/admin/campanhas/campanha-model'
const original: CampanhaDraft = {
  id: 3, nome: 'Carnaval', slug: 'carnaval', mes: 'Fevereiro', chamada: 'Sua marca no bloco',
  imagem: { id: 40, url: 'https://m.test/40.webp' }, conteudo: { root: { children: [] } },
  produtos: [{ id: 7, nome: 'Copo' }, 9], ativo: true, updatedAt: '2026-10-01T00:00:00.000Z',
}
describe('gravacao da campanha', () => {
  it('envia apenas o campo alterado', () => {
    expect(campanhaBody({ ...original, mes: 'Março' }, original)).toEqual({ mes: 'Março' })
  })
  it('nao envia slug (protegido) nem nada quando igual', () => {
    expect(campanhaBody(original, original)).toEqual({})
    expect(campanhaBody({ ...original, nome: 'Novo' }, original)).not.toHaveProperty('slug')
  })
  it('normaliza imagem para id e produtos para ids', () => {
    const body = campanhaBody({ ...original, imagem: { id: 55 }, produtos: [{ id: 1, nome: 'X' }, 2] }, original)
    expect(body.imagem).toBe(55); expect(body.produtos).toEqual([1, 2])
    expect(campanhaBody({ ...original, imagem: null }, original).imagem).toBe(null)
  })
  it('extrai ids de produtos (objeto ou numero)', () => {
    expect(produtoIDs(original)).toEqual([7, 9])
  })
})
describe('duplicacao e novo', () => {
  it('a copia nasce inativa, sem id e sem slug', () => {
    const copy = copyCampanha(original)
    expect(copy.id).toBeUndefined(); expect(copy.slug).toBeUndefined(); expect(copy.ativo).toBe(false)
    expect(copy.nome).toBe('Carnaval (cópia)')
  })
  it('nova campanha comeca inativa e vazia', () => {
    const nova = newCampanha()
    expect(nova.ativo).toBe(false); expect(nova.produtos).toEqual([])
  })
})
describe('validacao e status', () => {
  it('cobra o nome', () => {
    expect(validateCampanha(original)).toBeUndefined()
    expect(validateCampanha({ ...original, nome: ' ' })?.field).toBe('bb-camp-nome')
  })
  it('descreve o status', () => {
    expect(campStatus(original)[0]).toBe('ok')
    expect(campStatus({ ...original, ativo: false })[0]).toBe('off')
  })
  it('traduz erro do servidor', () => {
    const issue = campSaveIssue(new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path: 'nome', message: 'obrig' }] } }] }))
    expect(issue.field).toBe('bb-camp-nome')
  })
})
