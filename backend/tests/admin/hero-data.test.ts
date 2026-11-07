import { describe, it, expect } from 'vitest'
import { byHeroOrder, copyHero, heroBody, heroPeriod, heroSaveIssue, heroStatus, newHero, validateHero, validHeroLink } from '../../src/admin/hero/hero-data'
import { RequestError } from '../../src/admin/friendly/api-errors'
import type { HeroDraft } from '../../src/admin/hero/hero-model'
const original: HeroDraft = {
  id: 5, nome: 'Janeiro', tipo: 'mensal', mes: 1, ordem: 2, ativo: true, theme: 'dark',
  tag: 'Volta às aulas', icone: 'sun', tituloAntes: 'O verão', tituloDestaque: 'com a sua marca',
  tituloDepois: '', sub: 'Squeezes', ctaLabel: 'Ver squeezes', ctaHref: '/catalogo?categoria=squeezes',
  imagemDesktop: { id: 30, url: 'https://midia.test/30.webp' }, imagemMobile: null, updatedAt: '2026-10-01T00:00:00.000Z',
}
describe('gravacao do banner sem perda de dados', () => {
  it('envia apenas o campo alterado', () => {
    expect(heroBody({ ...original, tag: 'Carnaval' }, original)).toEqual({ tag: 'Carnaval' })
  })
  it('normaliza a imagem desktop para o id e aceita remocao com null', () => {
    expect(heroBody({ ...original, imagemDesktop: { id: 44, url: 'x' } }, original)).toEqual({ imagemDesktop: 44 })
    expect(heroBody({ ...original, imagemDesktop: null }, original)).toEqual({ imagemDesktop: null })
  })
  it('nao envia nada quando nada mudou', () => {
    expect(heroBody(original, original)).toEqual({})
  })
  it('na criacao envia os campos definidos com a imagem normalizada', () => {
    const novo = newHero(3)
    const body = heroBody({ ...novo, nome: 'Março', tag: 'Consumidor', imagemDesktop: { id: 7 } })
    expect(body.nome).toBe('Março'); expect(body.tipo).toBe('mensal'); expect(body.mes).toBe(3)
    expect(body.imagemDesktop).toBe(7); expect(body).not.toHaveProperty('id')
  })
})
describe('duplicacao e novo', () => {
  it('a copia nasce inativa, sem id e com sufixo', () => {
    const copy = copyHero(original)
    expect(copy.id).toBeUndefined(); expect(copy.ativo).toBe(false); expect(copy.nome).toBe('Janeiro (cópia)')
    expect(copy.tag).toBe(original.tag)
  })
  it('novo banner comeca mensal, no mes pedido e inativo', () => {
    const novo = newHero(9)
    expect(novo.tipo).toBe('mensal'); expect(novo.mes).toBe(9); expect(novo.ativo).toBe(false)
  })
})
describe('validacao', () => {
  it('aceita um banner completo', () => { expect(validateHero(original)).toBeUndefined() })
  it('cobra nome, etiqueta e mes do mensal', () => {
    expect(validateHero({ ...original, nome: ' ' })?.field).toBe('bb-hero-nome')
    expect(validateHero({ ...original, tag: '' })?.field).toBe('bb-hero-tag')
    expect(validateHero({ ...original, mes: null })?.field).toBe('bb-hero-mes')
  })
  it('nao cobra mes quando o banner e fixo', () => {
    expect(validateHero({ ...original, tipo: 'fixo', mes: null })).toBeUndefined()
  })
  it('recusa links perigosos e aceita caminho do site ou http(s)', () => {
    expect(validHeroLink('')).toBe(true)
    expect(validHeroLink('/catalogo')).toBe(true)
    expect(validHeroLink('https://bb.com')).toBe(true)
    expect(validHeroLink('//evil.com')).toBe(false)
    expect(validHeroLink('javascript:alert(1)')).toBe(false)
    expect(validateHero({ ...original, ctaHref: 'javascript:alert(1)' })?.field).toBe('bb-hero-ctaHref')
  })
})
describe('rotulos e erros', () => {
  it('descreve o periodo e o status', () => {
    expect(heroPeriod(original)).toBe('Janeiro')
    expect(heroPeriod({ ...original, tipo: 'fixo' })).toBe('Sempre (fixo)')
    expect(heroStatus(original)[0]).toBe('ok')
    expect(heroStatus({ ...original, ativo: false })[0]).toBe('off')
  })
  it('ordena por ordem crescente', () => {
    expect([{ ordem: 3 }, { ordem: 1 }].sort(byHeroOrder as never).map((b: { ordem: number }) => b.ordem)).toEqual([1, 3])
  })
  it('traduz o erro do servidor para o campo do formulario', () => {
    const issue = heroSaveIssue(new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path: 'tag', message: 'obrigatorio' }] } }] }))
    expect(issue.field).toBe('bb-hero-tag')
  })
})
