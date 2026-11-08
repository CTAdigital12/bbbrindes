import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

// Cases / prova social: cliente, segmento e depoimento opcional.
export const Cases: CollectionConfig = {
  slug: 'cases',
  labels: { singular: 'Case', plural: 'Cases' },
  admin: {
    useAsTitle: 'titulo',
    group: 'Conteudo',
    description: 'Cases e prova social do site: cliente, segmento, titulo e resumo. O card usa a faixa de marca com o nome do cliente. Apos salvar, a publicacao leva alguns minutos.',
    defaultColumns: ['cliente', 'segmento'],
    components: { views: {
      list: { Component: '/admin/cases/CaseListView' },
      edit: { root: { Component: '/admin/cases/CaseEditView' } },
    } },
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
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: { description: 'Tags pra distribuir/relacionar com blog, cases e imprensa.' },
    },
  ],
}
