import { describe, it, expect } from 'vitest'
import { isActive, newRevendedor, revendedorBody, revSaveIssue, revStatus, validateRevendedor } from '../../src/admin/revendedores/revendedores-data'
import { nivelLabel } from '../../src/admin/revendedores/revendedores-model'
import { RequestError } from '../../src/admin/friendly/api-errors'
import type { RevendedorDraft, RevendedorRow } from '../../src/admin/revendedores/revendedores-model'

// Fixture local em memoria. Senha SEMPRE ficticia (nunca uma senha real).
const original: RevendedorRow = {
  id: 5, email: 'contato@acme.com.br', empresa: 'Acme Comercial LTDA', nomeFantasia: 'Acme',
  cnpj: '12.345.678/0001-90', inscricaoEstadual: '123', responsavel: 'Ana', telefone: '4133334444',
  whatsapp: '41999990000', site: 'acme.com.br', nivel: '2', ativo: true,
  enderecoEntrega: { logradouro: 'Rua A, 10', bairro: 'Centro', cidade: 'Curitiba', uf: 'PR', cep: '80000-000' },
  notas: 'cliente antigo', updatedAt: '2026-11-01T00:00:00.000Z',
}

describe('body de create', () => {
  it('manda email, senha e os campos preenchidos', () => {
    const draft: RevendedorDraft = { email: 'novo@loja.com', password: 'teste1234', empresa: 'Loja Nova LTDA', cnpj: '99.999.999/0001-99', responsavel: 'Bia', nivel: '3', ativo: true }
    const body = revendedorBody(draft)
    expect(body.email).toBe('novo@loja.com')
    expect(body.password).toBe('teste1234')
    expect(body.empresa).toBe('Loja Nova LTDA')
    expect(body.cnpj).toBe('99.999.999/0001-99')
    expect(body.responsavel).toBe('Bia')
    expect(body.nivel).toBe('3')
    expect(body.ativo).toBe(true)
  })
  it('nao manda campos vazios no create', () => {
    const body = revendedorBody({ email: 'x@y.com', password: 'teste1234', empresa: 'So Empresa LTDA', nomeFantasia: '' })
    expect(body).not.toHaveProperty('nomeFantasia')
    expect(body).not.toHaveProperty('nivel')
    expect(body.email).toBe('x@y.com')
    expect(body.password).toBe('teste1234')
  })
})

describe('body de edit (parcial)', () => {
  it('so o campo alterado, com o email sempre presente, sem senha em branco', () => {
    const body = revendedorBody({ ...original, responsavel: 'Bruno', password: '' }, original)
    expect(body).toEqual({ responsavel: 'Bruno', email: 'contato@acme.com.br' })
    expect(body).not.toHaveProperty('password')
  })
  it('manda a senha so quando preenchida', () => {
    const body = revendedorBody({ ...original, password: 'novasenha1' }, original)
    expect(body.password).toBe('novasenha1')
    expect(body.email).toBe('contato@acme.com.br')
  })
  it('sem mudanca de perfil, ainda manda o email (identifica a conta)', () => {
    expect(revendedorBody({ ...original, password: '' }, original)).toEqual({ email: 'contato@acme.com.br' })
  })
  it('detecta mudanca dentro do grupo endereco', () => {
    const body = revendedorBody({ ...original, password: '', enderecoEntrega: { ...original.enderecoEntrega, cidade: 'São Paulo' } }, original)
    expect(body.enderecoEntrega).toEqual({ ...original.enderecoEntrega, cidade: 'São Paulo' })
    expect(body.email).toBe('contato@acme.com.br')
  })
})

describe('regra critica: ativo exige nivel', () => {
  it('bloqueia ativar sem nivel (campo bb-rev-nivel)', () => {
    const issue = validateRevendedor({ email: 'a@b.com', password: 'teste1234', empresa: 'Empresa LTDA', ativo: true }, { isCreate: true })
    expect(issue?.field).toBe('bb-rev-nivel')
  })
  it('permite ativar com nivel', () => {
    expect(validateRevendedor({ email: 'a@b.com', password: 'teste1234', empresa: 'Empresa LTDA', ativo: true, nivel: '1' }, { isCreate: true })).toBeUndefined()
  })
  it('vale tambem no edit', () => {
    expect(validateRevendedor({ ...original, ativo: true, nivel: '' }, { isCreate: false })?.field).toBe('bb-rev-nivel')
  })
})

describe('validacao de empresa, email e senha', () => {
  it('cobra a empresa (razao social)', () => {
    expect(validateRevendedor({ email: 'a@b.com', password: 'teste1234', empresa: '  ' }, { isCreate: true })?.field).toBe('bb-rev-empresa')
  })
  it('cobra o email e o formato', () => {
    expect(validateRevendedor({ email: '', password: 'teste1234', empresa: 'Empresa LTDA' }, { isCreate: true })?.field).toBe('bb-rev-email')
    expect(validateRevendedor({ email: 'invalido', password: 'teste1234', empresa: 'Empresa LTDA' }, { isCreate: true })?.field).toBe('bb-rev-email')
  })
  it('cobra a senha so no create', () => {
    expect(validateRevendedor({ email: 'a@b.com', password: '', empresa: 'Empresa LTDA' }, { isCreate: true })?.field).toBe('bb-rev-password')
    expect(validateRevendedor({ ...original, password: '' }, { isCreate: false })).toBeUndefined()
  })
})

describe('traducao de erro do servidor', () => {
  const build = (path: string) => new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path, message: 'invalido' }] } }] })
  it('email duplicado/invalido vai para o campo email', () => {
    expect(revSaveIssue(build('email')).field).toBe('bb-rev-email')
  })
  it('cnpj duplicado vai para o campo cnpj', () => {
    expect(revSaveIssue(build('cnpj')).field).toBe('bb-rev-cnpj')
  })
})

describe('status e nivel', () => {
  it('descreve o status de gestao', () => {
    expect(revStatus(original)[0]).toBe('ok')
    expect(isActive(original)).toBe(true)
    expect(revStatus({ ...original, ativo: false })[0]).toBe('ag')
  })
  it('rotula o nivel e o vazio vira hifen', () => {
    expect(nivelLabel('2')).toBe('Tabela 2')
    expect(nivelLabel('')).toBe('-')
    expect(nivelLabel(null)).toBe('-')
  })
  it('novo revendedor comeca inativo e vazio', () => {
    const novo = newRevendedor()
    expect(novo.ativo).toBe(false); expect(novo.empresa).toBe(''); expect(novo.email).toBe('')
  })
})
