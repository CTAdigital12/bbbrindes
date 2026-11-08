import { describe, it, expect } from 'vitest'
import { newUser, userBody, userSaveIssue, validateUser } from '../../src/admin/users/users-data'
import { RequestError } from '../../src/admin/friendly/api-errors'
import type { UserDraft } from '../../src/admin/users/users-model'
const original: UserDraft = { id: 2, email: 'admin@bb.com' }
describe('gravacao do usuario', () => {
  it('no create manda email e senha', () => {
    expect(userBody({ email: 'novo@bb.com', password: 'segredo12' })).toEqual({ email: 'novo@bb.com', password: 'segredo12' })
  })
  it('no edit so manda o email quando muda, e nada quando igual', () => {
    expect(userBody({ ...original, email: 'admin@bb.com' }, original)).toEqual({})
    expect(userBody({ ...original, email: 'outro@bb.com' }, original)).toEqual({ email: 'outro@bb.com' })
  })
  it('senha so entra quando preenchida (vazia mantem a atual)', () => {
    expect(userBody({ ...original, password: '' }, original)).toEqual({})
    expect(userBody({ ...original, password: 'novasenha1' }, original)).toEqual({ password: 'novasenha1' })
  })
})
describe('validacao', () => {
  it('cobra email valido', () => {
    expect(validateUser({ email: '', password: 'x' }, true)?.field).toBe('bb-user-email')
    expect(validateUser({ email: 'semarroba', password: 'segredo12' }, true)?.field).toBe('bb-user-email')
    expect(validateUser({ email: 'ok@bb.com', password: 'segredo12' }, true)).toBeUndefined()
  })
  it('exige senha no create, nao no edit', () => {
    expect(validateUser({ email: 'ok@bb.com' }, true)?.field).toBe('bb-user-senha')
    expect(validateUser({ email: 'ok@bb.com' }, false)).toBeUndefined()
  })
  it('senha curta e barrada', () => {
    expect(validateUser({ email: 'ok@bb.com', password: '123' }, false)?.field).toBe('bb-user-senha')
  })
})
describe('erro do servidor', () => {
  it('email duplicado vira aviso no campo email', () => {
    const issue = userSaveIssue(new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path: 'email', message: 'dup' }] } }] }))
    expect(issue.field).toBe('bb-user-email')
  })
  it('newUser comeca vazio', () => {
    expect(newUser()).toEqual({ email: '', password: '' })
  })
})
