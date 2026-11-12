import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField, isAdminOrSelf, roleOf } from '../access/byRole'

// Usuarios do painel (administradores do site). Cada um entra com o proprio
// e-mail e senha. O campo `role` (item J) define o nivel de acesso: admin,
// editor (marketing) ou visualizador. Ver src/access/byRole.ts.
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Sistema',
    description: 'Administradores que entram no painel. Cada um acessa com o proprio e-mail e senha.',
    // Esconde a colecao Usuarios da navegacao/rotas de quem nao e admin. (A tela
    // custom da sidebar nao le este flag; a trava real esta no `access` abaixo.)
    hidden: ({ user }) => roleOf(user) !== 'admin',
    components: { views: {
      list: { Component: '/admin/users/UserListView' },
      edit: { root: { Component: '/admin/users/UserEditView' } },
    } },
  },
  auth: true,
  // Gestao de contas e so do admin. Quem nao e admin enxerga/edita apenas a
  // propria conta (ex.: trocar a propria senha), e nunca cria nem remove contas.
  // NAO usamos `access.admin` aqui: nesta colecao de auth ele controla o acesso
  // ao painel inteiro, e trancaria editor/visualizador pra fora do /admin.
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    // Email e senha ja vem do auth.
    {
      name: 'role',
      type: 'select',
      label: 'Nivel de acesso',
      required: true,
      defaultValue: 'admin',
      // So admin troca o nivel (ninguem se auto-promove).
      access: { update: isAdminField },
      options: [
        { label: 'Administrador (acesso total)', value: 'admin' },
        { label: 'Editor (marketing): cria e edita conteudo', value: 'editor' },
        { label: 'Visualizador: so consulta', value: 'visualizador' },
      ],
      admin: {
        description:
          'Admin faz tudo. Editor cria e edita conteudo (nao mexe em usuarios nem remove). Visualizador so consulta.',
      },
    },
  ],
}
