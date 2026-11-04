import type { CollectionConfig } from 'payload'

// Collection LEGADA. O hero do site le a collection `hero-slides` ("Banners do
// hero"), NAO esta; e nenhuma pagina do front usa getBanners. Fica escondida do
// admin (admin.hidden) pra nao confundir com "Banners do hero": o cliente tentava
// desativar o hero AQUI e nada acontecia (bug 03/11). Reversivel: hidden=false.
export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: { singular: 'Banner', plural: 'Banners' },
  admin: {
    hidden: true,
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
