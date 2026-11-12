import type { CollectionConfig } from 'payload'

import { isAdmin, isEditorOrAdmin } from '../access/byRole'
import { slugField } from '../fields/slug'

// Blog institucional.
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Blog' },
  admin: {
    useAsTitle: 'titulo',
    group: 'Conteudo',
    description: 'Artigos do blog da BB Brindes. O mais recente aparece primeiro, pela data.',
    defaultColumns: ['titulo', 'data'],
    components: { views: {
      list: { Component: '/admin/posts/PostListView' },
      edit: { root: { Component: '/admin/posts/PostEditView' } },
    } },
  },
  // Leitura publica (o site estatico monta o blog pela API). Escrita: admin ou
  // editor (marketing); remocao so admin. Access reutilizavel: src/access/byRole.ts.
  access: {
    read: () => true,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
  },
  defaultSort: '-data',
  fields: [
    { name: 'titulo', type: 'text', required: true },
    slugField('titulo'),
    { name: 'resumo', type: 'textarea' },
    // Autor acima de Data (item I da revisao do Plinio).
    { name: 'autor', type: 'text' },
    { name: 'data', type: 'date', required: true },
    { name: 'capa', type: 'upload', relationTo: 'media' },
    { name: 'conteudo', type: 'richText' },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: { description: 'Tags pra distribuir/relacionar com blog, cases e imprensa.' },
    },
  ],
}
