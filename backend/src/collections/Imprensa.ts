import type { CollectionConfig } from 'payload'

// Materias de imprensa / clipping: veiculo, data, resumo e link externo.
export const Imprensa: CollectionConfig = {
  slug: 'imprensa',
  labels: { singular: 'Materia', plural: 'Imprensa' },
  admin: {
    useAsTitle: 'titulo',
    group: 'Conteudo',
    defaultColumns: ['veiculo', 'data', 'titulo'],
  },
  access: {
    read: () => true,
  },
  defaultSort: '-data',
  fields: [
    { name: 'titulo', type: 'text', required: true },
    { name: 'veiculo', type: 'text', required: true },
    { name: 'data', type: 'date', required: true },
    { name: 'resumo', type: 'textarea' },
    { name: 'url', type: 'text', label: 'Link da materia' },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: { description: 'Tags pra distribuir/relacionar com blog, cases e imprensa.' },
    },
  ],
}
