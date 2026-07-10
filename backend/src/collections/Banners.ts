import type { CollectionConfig } from 'payload'

// Banners editaveis da home. Uma colecao so cobre o carrossel principal e os
// mini banners: o campo `posicao` diferencia (evita duas colecoes quase iguais).
export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: { singular: 'Banner', plural: 'Banners' },
  admin: {
    useAsTitle: 'titulo',
    group: 'Conteudo',
    defaultColumns: ['titulo', 'posicao', 'ativo', 'ordem'],
  },
  access: {
    read: () => true,
  },
  defaultSort: 'ordem',
  fields: [
    { name: 'titulo', type: 'text', required: true },
    { name: 'subtitulo', type: 'text' },
    { name: 'cta', type: 'text', label: 'Texto do botao' },
    { name: 'href', type: 'text', label: 'Link de destino' },
    { name: 'imagem', type: 'upload', relationTo: 'media' },
    {
      name: 'posicao',
      type: 'select',
      required: true,
      defaultValue: 'carrossel',
      options: [
        { label: 'Carrossel principal', value: 'carrossel' },
        { label: 'Mini banner', value: 'mini' },
      ],
    },
    { name: 'ativo', type: 'checkbox', defaultValue: true },
    { name: 'ordem', type: 'number', defaultValue: 0 },
  ],
}
