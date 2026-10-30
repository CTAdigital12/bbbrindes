import type { CollectionConfig } from 'payload'

// Collection de Logos das marcas (FB-6, marquee da home). Upload PROPRIO (nao a
// Media) porque os logos sao SVG e nao podem passar pela conversao webp da Media
// (rasterizaria o vetor). Sem formatOptions/imageSizes: preserva o arquivo original.
// Em prod o arquivo vai pro R2 (ver s3Storage no payload.config: collections.logos).
// O front le os logos desta collection com fallback nos SVGs estaticos /img/logos.
export const Logos: CollectionConfig = {
  slug: 'logos',
  labels: { singular: 'Logo', plural: 'Logos' },
  admin: {
    group: 'Conteudo',
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'ordem'],
    description: 'Logos das marcas no marquee da home. Suba o arquivo (SVG ou PNG) e defina a ordem.',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'nome', type: 'text', required: true },
    { name: 'ordem', type: 'number', admin: { description: 'Ordem no marquee (menor primeiro).' } },
  ],
  upload: {
    // So imagem; sem formatOptions/imageSizes de proposito (mantem o SVG/vetor).
    mimeTypes: ['image/svg+xml', 'image/png', 'image/webp'],
  },
}
