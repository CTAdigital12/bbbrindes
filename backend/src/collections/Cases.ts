import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

// Cases / prova social: cliente, segmento e depoimento opcional.
export const Cases: CollectionConfig = {
  slug: 'cases',
  labels: { singular: 'Case', plural: 'Cases' },
  admin: {
    useAsTitle: 'titulo',
    group: 'Conteudo',
    defaultColumns: ['cliente', 'segmento'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'cliente', type: 'text', required: true },
    { name: 'titulo', type: 'text', required: true },
    slugField('titulo'),
    { name: 'segmento', type: 'text' },
    { name: 'resumo', type: 'textarea' },
    { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Logo do cliente.' } },
    { name: 'imagem', type: 'upload', relationTo: 'media' },
    {
      name: 'depoimento',
      type: 'group',
      fields: [
        { name: 'texto', type: 'textarea' },
        { name: 'autor', type: 'text' },
      ],
    },
  ],
}
