import type { Access, FieldAccess } from 'payload'

// Niveis de acesso do painel (item J da revisao do Plinio 10/11).
// - admin: acesso total (gerencia usuarios, publica e remove tudo).
// - editor: perfil marketing. Cria e edita conteudo, mas nao mexe em usuarios
//   nem remove registros.
// - visualizador: so consulta, nao salva nada.
//
// COMPATIBILIDADE (importante no deploy): usuarios criados antes deste campo
// ficam com `role` nulo no banco. Tratamos role ausente como "admin" pra NAO
// trancar fora quem ja tinha acesso total ao painel. O defaultValue do campo
// tambem e 'admin' pelo mesmo motivo. Quem precisar restringir rebaixa o usuario
// na tela de Usuarios depois.
export type Role = 'admin' | 'editor' | 'visualizador'

export function roleOf(user: unknown): Role {
  const role = (user as { role?: unknown } | null | undefined)?.role
  return role === 'editor' || role === 'visualizador' ? role : 'admin'
}

export function hasRole(user: unknown, ...roles: Role[]): boolean {
  return roles.includes(roleOf(user))
}

// ATENCAO: roleOf trata role ausente como 'admin' (legado), entao SEMPRE cheque
// que o usuario existe ANTES de olhar o role. Sem isso, um request anonimo
// (req.user = null) cairia no default 'admin' e passaria como administrador.

// --- Acesso em nivel de colecao (read / create / update / delete) ---

// Qualquer usuario autenticado.
export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

// Somente administradores.
export const isAdmin: Access = ({ req }) => Boolean(req.user) && hasRole(req.user, 'admin')

// Administrador ou editor (marketing): quem pode criar/editar conteudo.
export const isEditorOrAdmin: Access = ({ req }) => Boolean(req.user) && hasRole(req.user, 'admin', 'editor')

// Admin enxerga/edita tudo; qualquer outro logado so o proprio registro.
// Usado na colecao Users (um editor so mexe na propria conta).
export const isAdminOrSelf: Access = ({ req }) => {
  if (!req.user) return false
  if (hasRole(req.user, 'admin')) return true
  return { id: { equals: req.user.id } }
}

// --- Acesso em nivel de campo ---

// So admin altera o campo (ex.: o proprio nivel de acesso, pra ninguem se promover).
export const isAdminField: FieldAccess = ({ req }) => Boolean(req.user) && hasRole(req.user, 'admin')
