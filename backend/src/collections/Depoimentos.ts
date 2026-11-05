import type { CollectionConfig } from 'payload'

// Depoimentos de clientes (FB-6, conectividade front<->admin). Antes fixos no
// front (QUOTES em home-joy.ts); agora editaveis no /admin. Aparecem na home e na
// pagina de cases. O front le com fallback no mock enquanto a collection estiver
// vazia, entao nada regride ate o Plinio cadastrar os reais.
export const Depoimentos: CollectionConfig = {
  slug: 'depoimentos',
  labels: { singular: 'Depoimento', plural: 'Depoimentos' },
  admin: {
    useAsTitle: 'autor',
    group: 'Conteudo',
    defaultColumns: ['autor', 'empresa', 'ativo', 'ordem'],
    description: 'Depoimentos de clientes exibidos na home e na pagina de cases.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'texto',
      type: 'textarea',
      required: true,
      label: 'Depoimento',
      admin: { description: 'Escreva sem aspas; o site ja coloca as aspas.' },
    },
    {
      name: 'autor',
      type: 'text',
      required: true,
      label: 'Autor',
      admin: { description: 'Nome da pessoa. Ex.: Lilian Bueno.' },
    },
    {
      name: 'empresa',
      type: 'text',
      label: 'Empresa',
      admin: { description: 'Ex.: Braskem. O site mostra "Autor, Empresa".' },
    },
    {
      name: 'foto',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image' } },
      admin: { description: 'Opcional. Foto da pessoa.' },
    },
    {
      name: 'ordem',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Menor aparece primeiro.' },
    },
    { name: 'ativo', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
