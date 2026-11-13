// Usuarios do painel (colecao de auth `users`): administradores que entram no /admin.
// So email e senha (o schema nao tem campos extras). A senha nunca volta da API,
// entao o campo de senha comeca sempre vazio.
export type UserRole = 'admin' | 'editor' | 'visualizador'
export type UserDraft = { id?: number; email: string; password?: string; role?: UserRole; updatedAt?: string }
export type UserRow = { id: number; email: string; role?: UserRole; createdAt?: string; updatedAt?: string }
export type UserIssue = { message: string; field?: string }
export const USER_PATH = '/admin/collections/users'
// Papeis do painel (item J). Espelha o campo `role` da colecao Users + access/byRole.ts.
export const USER_ROLES: { value: UserRole; label: string; hint: string }[] = [
  { value: 'admin', label: 'Administrador (acesso total)', hint: 'Faz tudo: gerencia usuários, publica e remove.' },
  { value: 'editor', label: 'Editor (marketing)', hint: 'Cria e edita conteúdo. Não mexe em usuários nem remove.' },
  { value: 'visualizador', label: 'Visualizador (só consulta)', hint: 'Só consulta. Não salva nada.' },
]
export function roleLabel(role?: UserRole): string {
  return (USER_ROLES.find(r => r.value === (role || 'admin')) ?? USER_ROLES[0]).label
}
