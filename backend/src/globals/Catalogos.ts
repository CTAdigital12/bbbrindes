import type { GlobalConfig } from 'payload'

import { rebuildGlobalAfterChange } from '../hooks/triggerDeploy'

// Global "Catalogo digital" (FB-6 midia). Torna editavel a pagina /catalogos, hoje
// hardcoded no front (app/catalogos/page.tsx): titulo/intro, a URL do flipbook
// (heyzine, embed via iframe) e os cards (atalhos). NAO e upload de PDF: o catalogo
// vive no heyzine, aqui guarda-se so a URL + copy. Nasce preenchido via defaultValue
// com os valores que estao no ar, entao nao precisa de seed. O front le com fallback
// no mock.
export const Catalogos: GlobalConfig = {
  slug: 'catalogos',
  label: 'Catalogo digital',
  admin: {
    group: 'Conteudo',
    description:
      'Pagina /catalogos. A URL do flipbook e a do embed do heyzine (ex.: https://heyzine.com/flip-book/<id>.html).',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [rebuildGlobalAfterChange],
  },
  fields: [
    { name: 'titulo', type: 'text', defaultValue: 'Catálogo digital' },
    {
      name: 'intro',
      type: 'textarea',
      defaultValue: 'Folheie online e compartilhe o link com quem decide a compra.',
    },
    {
      name: 'flipbookUrl',
      type: 'text',
      label: 'URL do flipbook (heyzine)',
      defaultValue: 'https://heyzine.com/flip-book/aa2476761e.html',
    },
    {
      name: 'itens',
      type: 'array',
      label: 'Cards de catalogo',
      admin: { description: 'Atalhos exibidos abaixo do flipbook. URL vazia = abre o flipbook principal.' },
      defaultValue: [
        { nome: 'Catálogo BB Brindes 2027' },
        { nome: 'Linha Green (ecológicos)' },
        { nome: 'Datas comemorativas' },
      ],
      fields: [
        { name: 'nome', type: 'text', required: true },
        { name: 'url', type: 'text', admin: { description: 'Opcional. Vazio = usa a URL do flipbook principal.' } },
      ],
    },
  ],
}
