import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

// As 15 categorias validadas (revisao Plinio). Green Plasticaria, Green Fibras e
// Medalhas e Trofeus formam a familia "Ecologicos" (grupo no topo). "Datas
// Comemorativas" nao e categoria: vive em Campanhas.
export const Categorias: CollectionConfig = {
  slug: 'categorias',
  labels: { singular: 'Categoria', plural: 'Categorias' },
  admin: {
    useAsTitle: 'nome',
    group: 'Catalogo',
    defaultColumns: ['nome', 'grupo', 'ordem'],
  },
  access: {
    read: () => true,
  },
  defaultSort: 'ordem',
  fields: [
    { name: 'nome', type: 'text', required: true },
    slugField('nome'),
    {
      name: 'grupo',
      type: 'select',
      required: true,
      defaultValue: 'geral',
      options: [
        { label: 'Ecologicos', value: 'ecologicos' },
        { label: 'Geral', value: 'geral' },
      ],
      admin: { description: 'Ecologicos ficam agrupadas no topo da lista.' },
    },
    {
      name: 'ordem',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Ordem de exibicao (menor primeiro).' },
    },
    {
      name: 'icone',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Icone da categoria (grade estilo iFood na home).' },
    },
  ],
}
