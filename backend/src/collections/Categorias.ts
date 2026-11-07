import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

// As 14 categorias validadas (revisao Plinio). Green Plasticaria, Green Fibras e
// Medalhas e Trofeus formam a familia "Ecologicos" (grupo no topo). "Datas
// Comemorativas" nao e categoria: vive em Campanhas.
export const Categorias: CollectionConfig = {
  slug: 'categorias',
  labels: { singular: 'Categoria', plural: 'Categorias' },
  admin: {
    useAsTitle: 'nome',
    group: 'Catalogo',
    description: 'Categorias do catalogo: grade da home (estilo iFood) e menu de produtos. Ecologicos ficam no topo; a ordem define a sequencia.',
    defaultColumns: ['nome', 'grupo', 'ordem'],
    components: { views: {
      list: { Component: '/admin/categorias/CategoriaListView' },
      edit: { root: { Component: '/admin/categorias/CategoriaEditView' } },
    } },
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
