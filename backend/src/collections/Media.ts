import type { CollectionConfig } from 'payload'

import { isAdmin, isEditorOrAdmin } from '../access/byRole'

// Converte todo upload para WebP e gera tamanhos responsivos no upload (sharp).
// Assim o cliente sobe um JPEG/PNG pesado e o site serve a versao leve.
const toWebp = { format: 'webp' as const, options: { quality: 80 } }

// Dimensao recomendada por tipo de uso (item B da revisao do Plinio). TODO upload
// do painel (produto, campanha, blog, cases, etc.) passa por esta colecao, entao
// a dica aparece de forma generica em qualquer campo de imagem, sem precisar
// repetir em cada colecao.
const DICA_DIMENSOES =
  'Toda imagem do site passa por aqui. Aceita JPG, PNG ou WebP ate 15 MB; e convertida pra WebP e reduzida pro maximo de 2400px no lado maior. Dimensoes recomendadas por uso: foto de produto ~1200x1200px (quadrada); capa de campanha e banner da home ~1920x1080px (16:9); capa de post do blog ~1200x630px; foto de case ~1200x800px; logo de cliente ~600x300px (fundo transparente); icone de categoria ~240x240px. Use a maior qualidade possivel: o painel reduz sozinho.'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Sistema',
    description: DICA_DIMENSOES,
    components: { views: {
      list: { Component: '/admin/midia/MidiaListView' },
    } },
  },
  // Leitura publica (o site serve as imagens). Upload/edicao: admin ou editor;
  // remocao so admin (imagens sao compartilhadas entre varias colecoes).
  access: {
    read: () => true,
    create: isEditorOrAdmin,
    update: isEditorOrAdmin,
    delete: isAdmin,
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
