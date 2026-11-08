import { describe, it, expect } from 'vitest'
import { caseBody, caseSaveIssue, caseTags, copyCase, newCase, tagIDs, validateCase } from '../../src/admin/cases/cases-data'
import { RequestError } from '../../src/admin/friendly/api-errors'
import type { CaseDraft } from '../../src/admin/cases/cases-model'
const original: CaseDraft = {
  id: 7, cliente: 'Coca-Cola', titulo: 'Abridor Contour', slug: 'abridor-contour',
  segmento: 'Bebidas', resumo: 'Resumo do case.',
  logo: { id: 10, url: 'https://m.test/10.webp' }, imagem: { id: 20, url: 'https://m.test/20.webp' },
  depoimento: { texto: 'Ótimo parceiro', autor: 'João' },
  tags: [{ id: 1, nome: 'Bebidas' }, { id: 2, nome: 'Ecológico' }],
  updatedAt: '2026-10-01T00:00:00.000Z',
}
describe('gravacao do case', () => {
  it('envia apenas o campo alterado', () => {
    expect(caseBody({ ...original, segmento: 'Alimentos' }, original)).toEqual({ segmento: 'Alimentos' })
  })
  it('nao envia slug (protegido) nem nada quando igual', () => {
    expect(caseBody(original, original)).toEqual({})
    expect(caseBody({ ...original, titulo: 'Novo título' }, original)).not.toHaveProperty('slug')
  })
  it('normaliza logo e imagem para id da Media', () => {
    expect(caseBody({ ...original, logo: { id: 90 } }, original).logo).toBe(90)
    expect(caseBody({ ...original, imagem: null }, original).imagem).toBe(null)
  })
  it('tags viram ids e preservam a selecao', () => {
    const body = caseBody({ ...original, tags: [{ id: 5, nome: 'A' }, 9] }, original)
    expect(body.tags).toEqual([5, 9])
    expect(tagIDs(original)).toEqual([1, 2])
    expect(caseTags(original).map(t => t.nome)).toEqual(['Bebidas', 'Ecológico'])
  })
})
describe('duplicacao e novo', () => {
  it('a copia nasce sem id e sem slug, com sufixo', () => {
    const copy = copyCase(original)
    expect(copy.id).toBeUndefined(); expect(copy.slug).toBeUndefined()
    expect(copy.titulo).toBe('Abridor Contour (cópia)'); expect(copy.cliente).toBe('Coca-Cola')
  })
  it('novo case comeca vazio com depoimento e tags prontos', () => {
    const novo = newCase()
    expect(novo.cliente).toBe(''); expect(novo.titulo).toBe('')
    expect(novo.depoimento).toEqual({ texto: '', autor: '' }); expect(novo.tags).toEqual([])
  })
})
describe('validacao e erro', () => {
  it('cobra cliente e titulo', () => {
    expect(validateCase(original)).toBeUndefined()
    expect(validateCase({ ...original, cliente: ' ' })?.field).toBe('bb-cases-cliente')
    expect(validateCase({ ...original, titulo: ' ' })?.field).toBe('bb-cases-titulo')
  })
  it('traduz erro do servidor', () => {
    const issue = caseSaveIssue(new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path: 'cliente', message: 'obrig' }] } }] }))
    expect(issue.field).toBe('bb-cases-cliente')
  })
})
