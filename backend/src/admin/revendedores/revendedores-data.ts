import { RequestError } from '../friendly/api-errors'
import type { RevendedorDraft, RevendedorIssue } from './revendedores-model'

// Campos de perfil (sem email/password, que tem tratamento proprio no body).
const perfilFields = [
  'empresa', 'nomeFantasia', 'cnpj', 'inscricaoEstadual', 'responsavel',
  'telefone', 'whatsapp', 'site', 'nivel', 'ativo', 'enderecoEntrega', 'notas',
] as const

// Status de gestao: ativo = acesso liberado; senao cadastro em analise (sem acesso).
export const isActive = (r: RevendedorDraft): boolean => r.ativo === true
export const revStatus = (r: RevendedorDraft): [key: 'ok' | 'ag', label: string] =>
  isActive(r) ? ['ok', 'Ativo'] : ['ag', 'Em análise']

export function newRevendedor(): RevendedorDraft {
  return { email: '', password: '', empresa: '', ativo: false }
}

// E-mail em formato basico (a validacao forte mora no servidor/Payload auth).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const filled = (value?: string | null): boolean => typeof value === 'string' && value.trim().length > 0
function meaningful(value: unknown): boolean {
  if (value === undefined || value === null) return false
  if (typeof value === 'string') return value.trim().length > 0
  return true
}

// Monta o body da gravacao.
// CREATE (sem original): email + password + todos os campos preenchidos.
// EDIT (com original): PATCH parcial dos campos de perfil que mudaram; o email
// vai SEMPRE (identifica a conta); a senha vai SO quando preenchida (campo
// "nova senha, deixe em branco para manter"). A senha nunca e pre-preenchida.
export function revendedorBody(r: RevendedorDraft, original?: RevendedorDraft): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  for (const field of perfilFields) {
    const value = r[field]
    if (value === undefined) continue
    if (!original) {
      if (meaningful(value)) body[field] = value
    } else if (JSON.stringify(value) !== JSON.stringify(original[field])) {
      body[field] = value
    }
  }
  body.email = r.email
  if (!original) body.password = r.password ?? ''
  else if (filled(r.password)) body.password = r.password
  return body
}

// Validacao do cliente (espelha o servidor). isCreate cobra a senha so no cadastro.
export function validateRevendedor(r: RevendedorDraft, opts: { isCreate: boolean }): RevendedorIssue | undefined {
  if (!filled(r.empresa)) return { message: 'Preencha a razão social (empresa).', field: 'bb-rev-empresa' }
  if (!filled(r.email)) return { message: 'Informe o e-mail de acesso do revendedor.', field: 'bb-rev-email' }
  if (!EMAIL_RE.test(r.email.trim())) return { message: 'Confira o e-mail de acesso: o formato parece inválido.', field: 'bb-rev-email' }
  if (opts.isCreate && !filled(r.password)) return { message: 'Defina uma senha de acesso para o revendedor.', field: 'bb-rev-password' }
  // REGRA CRITICA: ativar exige nivel. Aprovar e atribuir a tabela e o mesmo passo.
  if (r.ativo === true && !r.nivel) return { message: 'Para ativar o revendedor, atribua o nível (tabela de preço) no mesmo passo.', field: 'bb-rev-nivel' }
  return undefined
}

// Traduz o erro do servidor (RequestError) para um campo amigavel.
function mentions(cause: RequestError, path: string, re: RegExp): boolean {
  return cause.fields.some(f => f.path === path) || re.test(cause.message) || cause.fields.some(f => re.test(f.message))
}
export function revSaveIssue(cause: unknown): RevendedorIssue {
  if (cause instanceof RequestError) {
    if (mentions(cause, 'email', /e-?mail/i)) return { message: 'Confira o e-mail de acesso: pode já estar em uso ou ter formato inválido.', field: 'bb-rev-email' }
    if (mentions(cause, 'cnpj', /cnpj/i)) return { message: 'Confira o CNPJ: já existe um revendedor com esse CNPJ.', field: 'bb-rev-cnpj' }
    if (cause.fields.some(f => f.path === 'empresa')) return { message: 'Confira a razão social (empresa).', field: 'bb-rev-empresa' }
    if (cause.fields.some(f => f.path === 'password')) return { message: 'Confira a senha de acesso.', field: 'bb-rev-password' }
    if (cause.fields.some(f => f.path === 'ativo')) return { message: 'Para ativar o revendedor, atribua o nível (tabela de preço) no mesmo passo.', field: 'bb-rev-nivel' }
    if (cause.fields.length) return { message: 'Confira os campos destacados e tente salvar novamente.' }
  }
  return { message: cause instanceof Error ? cause.message : 'Não foi possível salvar o revendedor. Tente novamente.' }
}
