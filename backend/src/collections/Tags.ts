import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

// Tags compartilhadas pra distribuir e relacionar conteudo entre blog, cases e
// imprensa (FB-6, item 6). O cliente cria as tags aqui e marca nos conteudos;
// o site usa pra agrupar/cruzar os tres.
export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: { singular: 'Tag', plural: 'Tags' },
  admin: {
    group: 'Conteudo',
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'slug'],
    description: 'Tags compartilhadas para distribuir e cruzar conteudo entre blog, cases e imprensa.',
    components: { views: {
      list: { Component: '/admin/tags/TagListView' },
      edit: { root: { Component: '/admin/tags/TagEditView' } },
    } },
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'nome', type: 'text', required: true },
    slugField('nome'),
  ],
}
