// Usuarios do painel (colecao de auth `users`): administradores que entram no /admin.
// So email e senha (o schema nao tem campos extras). A senha nunca volta da API,
// entao o campo de senha comeca sempre vazio.
export type UserDraft = { id?: number; email: string; password?: string; updatedAt?: string }
export type UserRow = { id: number; email: string; createdAt?: string; updatedAt?: string }
export type UserIssue = { message: string; field?: string }
export const USER_PATH = '/admin/collections/users'
