import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

// Blog institucional.
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Blog' },
  admin: {
    useAsTitle: 'titulo',
    group: 'Conteudo',
    defaultColumns: ['titulo', 'data'],
  },
  access: {
    read: () => true,
  },
  defaultSort: '-data',
  fields: [
    { name: 'titulo', type: 'text', required: true },
    slugField('titulo'),
    { name: 'resumo', type: 'textarea' },
    { name: 'data', type: 'date', required: true },
    { name: 'autor', type: 'text' },
    { name: 'capa', type: 'upload', relationTo: 'media' },
    { name: 'conteudo', type: 'richText' },
  ],
}
