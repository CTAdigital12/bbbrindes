import type { CollectionConfig } from 'payload'

// Converte todo upload para WebP e gera tamanhos responsivos no upload (sharp).
// Assim o cliente sobe um JPEG/PNG pesado e o site serve a versao leve.
const toWebp = { format: 'webp' as const, options: { quality: 80 } }

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Sistema',
    description:
      'Imagens ate 15 MB. Sao convertidas pra WebP e reduzidas pro maximo de 2400px no lado maior. Dimensoes recomendadas: foto de produto ~1200x1200px, logo de cliente ~600x300px (fundo transparente), banner/hero ~1920x1080px, icone de categoria ~240x240px.',
    components: { views: {
      list: { Component: '/admin/midia/MidiaListView' },
    } },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Descricao da imagem',
      admin: {
        description:
          'Descreva em poucas palavras o que aparece, ex.: "Squeeze 550 ml verde com a marca Oi". Serve pro Google entender a imagem e pra quem usa leitor de tela.',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    formatOptions: toWebp,
    // Dimensao maxima (FB-6): limita o lado maior a 2400px (2x o maior imageSize),
    // sem ampliar imagens menores. Reduz o original pesado sem rejeitar o upload.
    resizeOptions: { width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true },
    imageSizes: [
      { name: 'thumbnail', width: 300, height: 300, position: 'centre', formatOptions: toWebp },
      { name: 'card', width: 640, formatOptions: toWebp },
      { name: 'large', width: 1200, formatOptions: toWebp },
    ],
  },
}
