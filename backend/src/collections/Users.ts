import type { CollectionConfig } from 'payload'

// Usuarios do painel (administradores do site). O login e a auth de revendedor
// sao expandidos na S03-03; por ora fica o admin padrao com auth por email.
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Sistema',
    description: 'Administradores que entram no painel. Cada um acessa com o proprio e-mail e senha.',
    components: { views: {
      list: { Component: '/admin/users/UserListView' },
      edit: { root: { Component: '/admin/users/UserEditView' } },
    } },
  },
  auth: true,
  fields: [
    // Email e senha ja vem do auth. Campos extras entram na S03-03.
  ],
}
