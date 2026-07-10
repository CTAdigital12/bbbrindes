import type { CollectionConfig } from 'payload'

// Converte todo upload para WebP e gera tamanhos responsivos no upload (sharp).
// Assim o cliente sobe um JPEG/PNG pesado e o site serve a versao leve.
const toWebp = { format: 'webp' as const, options: { quality: 80 } }

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    formatOptions: toWebp,
    imageSizes: [
      { name: 'thumbnail', width: 300, height: 300, position: 'centre', formatOptions: toWebp },
      { name: 'card', width: 640, formatOptions: toWebp },
      { name: 'large', width: 1200, formatOptions: toWebp },
    ],
  },
}
