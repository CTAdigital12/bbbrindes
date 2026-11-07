import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

// Campanhas sazonais e datas comemorativas. Cada uma e destino de landing page
// ("campanha do mes") e pode destacar produtos.
export const Campanhas: CollectionConfig = {
  slug: 'campanhas',
  labels: { singular: 'Campanha', plural: 'Campanhas' },
  admin: {
    useAsTitle: 'nome',
    group: 'Conteudo',
    description: 'Campanhas publicadas no site: nome, imagem, texto e produtos. Apos salvar, a publicacao automatica leva alguns minutos. Os banners da home ficam em Banners do hero.',
    defaultColumns: ['nome', 'mes', 'ativo'],
    components: { views: {
      list: { Component: '/admin/campanhas/CampanhaListView' },
      edit: { root: { Component: '/admin/campanhas/CampanhaEditView' } },
    } },
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'nome', type: 'text', required: true },
    slugField('nome'),
    { name: 'mes', type: 'text', admin: { description: 'Mes ou periodo, ex.: Maio.' } },
    { name: 'chamada', type: 'text', label: 'Chamada / subtitulo' },
    { name: 'imagem', type: 'upload', relationTo: 'media' },
    {
      name: 'conteudo',
      type: 'richText',
      admin: { description: 'Conteudo da landing page da campanha.' },
    },
    {
      name: 'produtos',
      type: 'relationship',
      relationTo: 'produtos',
      hasMany: true,
      admin: { description: 'Produtos em destaque na campanha.' },
    },
    { name: 'ativo', type: 'checkbox', defaultValue: true, admin: { description: 'Publicar no menu, na home e na pagina da campanha. Desmarque para retirar do site na proxima publicacao.' } },
  ],
}
