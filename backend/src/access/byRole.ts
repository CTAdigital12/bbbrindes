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

// ATENCAO: duas armadilhas do roleOf, as duas tratadas pelos gates abaixo.
// 1) roleOf trata role ausente como 'admin' (legado). Por isso todo gate confere
//    o principal ANTES de olhar o role (senao um request anonimo, req.user = null,
//    cairia no default 'admin').
// 2) role ausente tambem vale pra QUALQUER principal de outra colecao de auth.
//    O site tem uma segunda colecao com `auth` (revendedores), e o revendedor
//    logado nao tem campo `role`: sem cuidado ele cairia no default 'admin',
//    escreveria conteudo e ate criaria/apagaria usuarios admin (escalonamento).
//    Por isso os gates de papel exigem isPanelUser: o legado "role nulo = admin"
//    vale SO pra colecao 'users'. Principal de outra colecao nunca e admin/editor
//    por aqui.

// Pertence a colecao do painel (`users`)? req.user.collection existe no servidor
// (payload/auth) e distingue o usuario do painel do revendedor (e de qualquer
// outra colecao de auth futura).
export function isPanelUser(user: unknown): boolean {
  return (user as { collection?: unknown } | null | undefined)?.collection === 'users'
}

// --- Acesso em nivel de colecao (read / create / update / delete) ---

// Qualquer usuario autenticado (de qualquer colecao de auth). NAO confere papel:
// use so onde "estar logado" basta, nunca como gate de admin/editor.
export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

// Somente administradores do painel.
export const isAdmin: Access = ({ req }) => isPanelUser(req.user) && hasRole(req.user, 'admin')

// Administrador ou editor (marketing) do painel: quem pode criar/editar conteudo.
export const isEditorOrAdmin: Access = ({ req }) => isPanelUser(req.user) && hasRole(req.user, 'admin', 'editor')

// Admin do painel enxerga/edita tudo; outro usuario do painel so o proprio
// registro (um editor/visualizador so mexe na propria conta). Principal de outra
// colecao: negado. Usado na colecao Users.
export const isAdminOrSelf: Access = ({ req }) => {
  const { user } = req
  if (!user || !isPanelUser(user)) return false
  if (hasRole(user, 'admin')) return true
  return { id: { equals: user.id } }
}

// --- Acesso em nivel de campo ---

// So admin do painel altera o campo (ex.: o proprio nivel de acesso, pra ninguem
// se promover).
export const isAdminField: FieldAccess = ({ req }) => isPanelUser(req.user) && hasRole(req.user, 'admin')
