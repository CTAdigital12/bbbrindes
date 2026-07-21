import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

// Produto do catalogo. O conteudo editorial/SEO (subtitulo, descricoes,
// beneficios, idealPara, diferenciais) segue o modelo de PDP do Plinio e vive
// aqui. Preco e estoque tem origem ERP e ficam no grupo `erp` (placeholder ate a
// integracao); o SKU e a chave que o ERP casa depois, sem sobrescrever o conteudo.
export const Produtos: CollectionConfig = {
  slug: 'produtos',
  labels: { singular: 'Produto', plural: 'Produtos' },
  admin: {
    useAsTitle: 'nome',
    group: 'Catalogo',
    defaultColumns: ['nome', 'sku', 'categoria', 'faixaPreco'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Chave de integracao com o ERP. Nao e sobrescrita pelo import de conteudo.',
      },
    },
    { name: 'nome', type: 'text', required: true },
    slugField('nome'),
    {
      name: 'subtitulo',
      type: 'text',
      admin: { description: 'Frase curta que reforca o principal diferencial (modelo Plinio).' },
    },
    { name: 'descricaoCurta', type: 'textarea', label: 'Descricao curta' },
    { name: 'descricaoCompleta', type: 'richText', label: 'Descricao completa' },
    { name: 'beneficios', type: 'text', hasMany: true, label: 'Principais beneficios' },
    { name: 'idealPara', type: 'text', hasMany: true, label: 'Ideal para' },
    {
      name: 'diferenciaisProduto',
      type: 'text',
      hasMany: true,
      label: 'Diferenciais BB brindes no produto',
    },
    {
      name: 'categoria',
      type: 'relationship',
      relationTo: 'categorias',
      required: true,
    },
    { name: 'material', type: 'text' },
    { name: 'aplicacoes', type: 'text', hasMany: true },
    {
      name: 'cores',
      type: 'array',
      labels: { singular: 'Cor', plural: 'Cores' },
      fields: [
        { name: 'nome', type: 'text', required: true },
        {
          name: 'hex',
          type: 'text',
          required: true,
          admin: { description: 'Cor em hexadecimal, ex.: #1a2b3c.' },
        },
      ],
    },
    {
      name: 'imagens',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Galeria do produto. A primeira e a imagem principal.' },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video (URL)',
      admin: { description: 'Opcional. Link de video exibido na PDP (pedido do Plinio).' },
    },
    {
      name: 'faixaPreco',
      type: 'select',
      label: 'Faixa de preco (publica)',
      options: [
        { label: 'Ate R$ 3,99', value: 'ate-3-99' },
        { label: 'R$ 4 a R$ 15', value: '4-a-15' },
        { label: 'Acima de R$ 15', value: 'acima-de-15' },
      ],
      admin: {
        description: 'Faixa exibida no catalogo publico. O B2B nao mostra preco exato.',
      },
    },
    {
      name: 'destaques',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Destaque', value: 'destaque' },
        { label: 'Mais vendido', value: 'mais-vendido' },
        { label: 'Lancamento', value: 'lancamento' },
      ],
      admin: { description: 'Faixas da home onde o produto aparece.' },
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [{ label: 'Ecologico', value: 'ecologico' }],
    },
    {
      name: 'erp',
      type: 'group',
      label: 'Dados do ERP',
      admin: {
        description:
          'Origem: ERP. Placeholder ate a integracao (S03 nao sobrescreve). Nao editar como fonte da verdade.',
      },
      fields: [
        {
          name: 'preco',
          type: 'number',
          admin: { description: 'Preco unitario (BRL). Alimentado pelo ERP.' },
        },
        {
          name: 'estoque',
          type: 'number',
          admin: { description: 'Saldo em estoque. Alimentado pelo ERP.' },
        },
      ],
    },
  ],
}
