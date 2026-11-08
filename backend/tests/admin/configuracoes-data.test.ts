import { describe, it, expect } from 'vitest'
import { configBody, configSaveIssue, onlyDigits, validateConfig, waLink } from '../../src/admin/configuracoes/configuracoes-data'
import { RequestError } from '../../src/admin/friendly/api-errors'
import type { ConfigContent } from '../../src/admin/configuracoes/configuracoes-model'
const base: ConfigContent = {
  contato: { telefone: '(71) 99416-0138', whatsapp: '5571994160138', email: 'comercial@bbgrupo.com.br', endereco: 'Lauro de Freitas / BA', horario: 'Seg a sex', cnpj: '11.158.637/0001-27' },
  redes: { instagram: 'https://instagram.com/x', linkedin: '', facebook: 'https://facebook.com/x', pinterest: '', youtube: '' },
  descricao: 'Indústria brasileira de brindes.',
  selos: [{ id: 'a', nome: 'SGP' }, { id: 'b', nome: 'GMP' }],
}
describe('gravacao das configuracoes', () => {
  it('manda todos os blocos (nenhum some)', () => {
    const body = configBody(base)
    for (const key of ['contato', 'redes', 'descricao', 'selos']) expect(body).toHaveProperty(key)
  })
  it('monta o grupo de contato completo', () => {
    const body = configBody(base) as { contato: Record<string, string> }
    expect(body.contato).toEqual(base.contato)
  })
  it('preserva os ids das linhas de selos', () => {
    const body = configBody(base) as { selos: { id?: string; nome: string }[] }
    expect(body.selos[0]).toEqual({ id: 'a', nome: 'SGP' })
  })
  it('redes em branco viram string vazia (icone escondido no site)', () => {
    const body = configBody({ redes: { linkedin: '  ' } }) as { redes: Record<string, string> }
    expect(body.redes.linkedin).toBe('')
    expect(body.redes.instagram).toBe('')
  })
  it('campos ausentes nao quebram (default vazio)', () => {
    const body = configBody({}) as { contato: Record<string, string>; selos: unknown[] }
    expect(body.contato.telefone).toBe('')
    expect(body.selos).toEqual([])
  })
})
describe('helpers de contato', () => {
  it('onlyDigits limpa o telefone', () => { expect(onlyDigits('(71) 99416-0138')).toBe('71994160138') })
  it('waLink monta o link wa.me com so os digitos', () => { expect(waLink('5571994160138')).toBe('https://wa.me/5571994160138') })
})
describe('validacao das configuracoes', () => {
  it('aceita um conteudo completo', () => { expect(validateConfig(base)).toBeUndefined() })
  it('cobra o nome de todos os selos', () => {
    expect(validateConfig({ ...base, selos: [{ nome: '' }] })?.message).toMatch(/Selos/)
    expect(validateConfig({ ...base, selos: [{ nome: '   ' }] })?.message).toMatch(/Selos/)
  })
  it('avisa quando o WhatsApp tem algo alem de numeros', () => {
    expect(validateConfig({ ...base, contato: { whatsapp: '(71) 99416-0138' } })?.message).toMatch(/WhatsApp/)
  })
  it('aceita WhatsApp vazio', () => {
    expect(validateConfig({ ...base, contato: { whatsapp: '' } })).toBeUndefined()
  })
})
describe('erro de servidor', () => {
  it('vira mensagem amigavel', () => {
    const issue = configSaveIssue(new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path: 'selos', message: 'y' }] } }] }))
    expect(issue.message).toMatch(/Confira/)
  })
})
