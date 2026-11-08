import { describe, it, expect } from 'vitest'
import { catalogosBody, catalogosSaveIssue, isHttpUrl, validateCatalogos } from '../../src/admin/catalogos/catalogos-data'
import { RequestError } from '../../src/admin/friendly/api-errors'
import type { CatalogoContent } from '../../src/admin/catalogos/catalogos-model'
const base: CatalogoContent = {
  titulo: 'Catálogo digital',
  intro: 'Folheie online e compartilhe.',
  flipbookUrl: 'https://heyzine.com/flip-book/aa2476761e.html',
  itens: [{ id: 'a', nome: 'Catálogo 2027', url: '' }, { id: 'b', nome: 'Linha Green', url: 'https://heyzine.com/flip-book/green.html' }],
}
describe('gravacao do catalogo digital', () => {
  it('manda todos os campos (nenhum some)', () => {
    const body = catalogosBody(base)
    for (const key of ['titulo', 'intro', 'flipbookUrl', 'itens']) expect(body).toHaveProperty(key)
  })
  it('preserva os ids das linhas dos cards', () => {
    const body = catalogosBody(base) as { itens: { id?: string; nome: string; url: string }[] }
    expect(body.itens[0]).toEqual({ id: 'a', nome: 'Catálogo 2027', url: '' })
    expect(body.itens[1].id).toBe('b')
  })
  it('apara espacos da URL do flipbook e dos cards', () => {
    const body = catalogosBody({ flipbookUrl: '  https://x.test  ', itens: [{ nome: 'x', url: '  https://y.test  ' }] }) as { flipbookUrl: string; itens: { url: string }[] }
    expect(body.flipbookUrl).toBe('https://x.test')
    expect(body.itens[0].url).toBe('https://y.test')
  })
  it('campos ausentes nao quebram (default vazio)', () => {
    const body = catalogosBody({}) as { titulo: string; itens: unknown[] }
    expect(body.titulo).toBe('')
    expect(body.itens).toEqual([])
  })
})
describe('isHttpUrl', () => {
  it('aceita http/https e vazio', () => {
    expect(isHttpUrl('https://x.test')).toBe(true)
    expect(isHttpUrl('http://x.test')).toBe(true)
    expect(isHttpUrl('')).toBe(true)
    expect(isHttpUrl('   ')).toBe(true)
  })
  it('rejeita link sem esquema', () => {
    expect(isHttpUrl('heyzine.com/x')).toBe(false)
    expect(isHttpUrl('ftp://x.test')).toBe(false)
  })
})
describe('validacao do catalogo digital', () => {
  it('aceita um conteudo completo', () => { expect(validateCatalogos(base)).toBeUndefined() })
  it('cobra o nome de todos os cards', () => {
    expect(validateCatalogos({ ...base, itens: [{ nome: '' }] })?.message).toMatch(/Cards/)
  })
  it('exige URL http no flipbook', () => {
    expect(validateCatalogos({ ...base, flipbookUrl: 'heyzine.com/x' })?.message).toMatch(/flipbook/)
  })
  it('exige URL http nos links dos cards', () => {
    expect(validateCatalogos({ ...base, itens: [{ nome: 'x', url: 'heyzine.com/x' }] })?.message).toMatch(/links/)
  })
})
describe('erro de servidor', () => {
  it('vira mensagem amigavel', () => {
    const issue = catalogosSaveIssue(new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path: 'itens', message: 'y' }] } }] }))
    expect(issue.message).toMatch(/Confira/)
  })
})
