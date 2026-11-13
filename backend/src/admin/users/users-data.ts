import { RequestError } from '../friendly/api-errors'
import type { UserDraft, UserIssue } from './users-model'
export function newUser(): UserDraft {
  return { email: '', password: '', role: 'admin' }
}
// create: email + senha + papel. edit: email so quando muda; senha so quando preenchida
// (vazia = mantem a atual); papel so quando muda. A senha nunca e pre-carregada.
// O campo `role` so e aceito pela API se quem salva for admin (access isAdminField).
export function userBody(user: UserDraft, original?: UserDraft): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  const email = user.email.trim()
  if (!original) {
    body.email = email
    if (user.password) body.password = user.password
    body.role = user.role || 'admin'
    return body
  }
  if (email !== (original.email || '').trim()) body.email = email
  if (user.password) body.password = user.password
  if (user.role && user.role !== original.role) body.role = user.role
  return body
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export function validateUser(user: UserDraft, isNew: boolean): UserIssue | undefined {
  const email = user.email.trim()
  if (!email) return { message: 'Informe o e-mail do usuario.', field: 'bb-user-email' }
  if (!EMAIL_RE.test(email)) return { message: 'E-mail invalido. Confira o endereco.', field: 'bb-user-email' }
  if (isNew && !user.password) return { message: 'Defina uma senha para o novo usuario.', field: 'bb-user-senha' }
  if (user.password && user.password.length < 8) return { message: 'A senha precisa de ao menos 8 caracteres.', field: 'bb-user-senha' }
  return undefined
}
export function userSaveIssue(cause: unknown): UserIssue {
  if (cause instanceof RequestError) {
    if (cause.fields.some(f => f.path === 'email')) return { message: 'Confira o e-mail: pode ja estar em uso.', field: 'bb-user-email' }
    if (cause.fields.some(f => f.path === 'password')) return { message: 'Confira a senha.', field: 'bb-user-senha' }
    if (cause.fields.length) return { message: 'Confira os campos e tente salvar novamente.' }
  }
  return { message: cause instanceof Error ? cause.message : 'Nao foi possivel salvar o usuario. Tente novamente.' }
}
