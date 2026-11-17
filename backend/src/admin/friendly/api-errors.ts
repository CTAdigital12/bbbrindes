export type ValidationField = { path: string; message: string }
type ApiMessage = { message?: unknown; data?: { errors?: ValidationField[] } }
type ApiBody = { errors?: ApiMessage[]; message?: unknown }
function apiMessages(body: ApiBody) {
  const errors = Array.isArray(body.errors) ? body.errors : []
  return errors.map(error => error?.message).filter((message): message is string => typeof message === 'string' && Boolean(message))
}
function fieldErrors(body: ApiBody): ValidationField[] {
  const errors = Array.isArray(body.errors) ? body.errors : []
  return errors.flatMap(error => {
    const fields = error?.data?.errors
    if (!Array.isArray(fields)) return []
    return fields.filter(field => typeof field?.path === 'string').map(field => ({ path: field.path, message: typeof field.message === 'string' ? field.message : '' }))
  })
}
function apiMessage(body: ApiBody) {
  const messages = apiMessages(body)
  if (messages.length) return messages.join(' ')
  return typeof body.message === 'string' && body.message ? body.message : 'Não foi possível concluir. Tente novamente.'
}
// Mensagem clara para falha de permissao/sessao. Sem isso, um 403 do Payload
// chegaria em ingles ("You are not allowed to perform this action"). Como o gate
// de escrita (byRole) bloqueia o visualizador no servidor, um PATCH/POST negado
// volta 403: tem que aparecer como erro claro de permissao, nunca como sucesso.
function messageForStatus(status: number, body: ApiBody) {
  if (status === 403) return 'Seu acesso é somente de leitura. Peça a um administrador para salvar esta alteração.'
  if (status === 401) return 'Sua sessão expirou. Entre novamente para salvar.'
  return apiMessage(body)
}
export class RequestError extends Error {
  readonly fields: ValidationField[]
  constructor(readonly status: number, result: unknown) {
    const body: ApiBody = result && typeof result === 'object' ? result : {}
    super(messageForStatus(status, body))
    this.name = 'RequestError'
    this.fields = fieldErrors(body)
  }
}
