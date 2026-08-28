import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

// Produto do catalogo. Schema alinhado ao modelo validado com o Plinio
// (docs/modelo-produto.md, secoes 4 e 11) e a planilha real de produtos.
//
// Bloqueios ainda abertos (docs/modelo-produto.md secao 14), refletidos aqui:
// 1. Granularidade CL/PB indefinida: `codigoCigam` NAO e unique (233 CL e 233 PB
//    compartilham o mesmo CIGAM). `codigoSite` (comercial, ja com sufixo) e unique.
// 2. Cor/variacao sem fonte de dado estruturada: por ora as cores ficam no array
//    `cores` (cadastro manual). SKU-por-cor e imagem-por-cor entram quando o Plinio
//    entregar a fonte de cor/tom e a convencao de imagem.
//
// Preco e estoque vem do CRM (Leads2b) -> ERP; ficam no grupo `crm` como
// placeholder ate a integracao (S03-09), sem ser fonte da verdade editorial.
export const Produtos: CollectionConfig = {
  slug: 'produtos',
  labels: { singular: 'Produto', plural: 'Produtos' },
  admin: {
    useAsTitle: 'nome',
    group: 'Catalogo',
    defaultColumns: ['nome', 'codigoSite', 'ecologico'],
  },
  access: {
    read: () => true,
  },
  fields: [
    // Identificacao (sidebar). Dois codigos: comercial (site) e integrador (CIGAM).
    {
      name: 'codigoSite',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Codigo site',
      admin: {
        position: 'sidebar',
        description: 'Comercial, exibido ao cliente. Alfanumerico (ex.: 109, 233 CL).',
      },
    },
    {
      name: 'codigoCigam',
      type: 'text',
      index: true,
      label: 'Codigo CIGAM',
      admin: {
        position: 'sidebar',
        description:
          'Chave de integracao CRM/ERP. NAO e unique: variacoes CL/PB compartilham o mesmo CIGAM (ver modelo-produto.md secao 3).',
      },
    },

    // Conteudo publico da PDP.
    { name: 'nome', type: 'text', required: true },
    slugField('nome'),
    {
      name: 'subtitulo',
      type: 'textarea',
      admin: { description: 'Texto de 1 a 2 frases (planilha traz texto longo).' },
    },
    {
      name: 'headline',
      type: 'text',
      admin: { description: 'Chamada do produto. Com o nome, e a primeira chamada da PDP.' },
    },
    { name: 'descricaoCurta', type: 'textarea', label: 'Descricao curta (SEO)' },
    { name: 'descricaoCompleta', type: 'richText', label: 'Descricao completa' },
    { name: 'beneficios', type: 'text', hasMany: true, label: 'Principais beneficios' },
    { name: 'idealPara', type: 'text', hasMany: true, label: 'Ideal para' },
    {
      name: 'diferenciais',
      type: 'text',
      hasMany: true,
      label: 'Diferenciais BB Brindes',
    },
    {
      name: 'especificacoes',
      type: 'array',
      labels: { singular: 'Especificacao', plural: 'Especificacoes' },
      fields: [
        { name: 'rotulo', type: 'text', required: true },
        { name: 'valor', type: 'text', required: true },
      ],
    },

    // SEO por produto (S03-02; o SEO estrutural do site fica na S03-07).
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'titleTag', type: 'text', label: 'Title tag' },
        { name: 'metaDescription', type: 'textarea', label: 'Meta description' },
        {
          name: 'palavrasChave',
          type: 'text',
          hasMany: true,
          label: 'Palavras-chave',
          admin: { description: 'Lista de termos (a planilha traz separados por virgula).' },
        },
        { name: 'altTextPrincipal', type: 'text', label: 'Alt text (foto principal)' },
      ],
    },

    // Interno: nao exibir no site (treinamento do atendimento).
    {
      name: 'argumentoComercial',
      type: 'textarea',
      admin: { description: 'INTERNO. Nao exibir no site. Por que o produto vende.' },
    },

    // Classificacao. Ate 3 categorias; a primeira e a principal (URL/breadcrumb).
    {
      name: 'categorias',
      type: 'relationship',
      relationTo: 'categorias',
      hasMany: true,
      required: true,
      maxDepth: 1,
      admin: {
        description: 'Ate 3. A PRIMEIRA e a principal (define URL e breadcrumb).',
      },
      validate: (value: unknown) => {
        if (Array.isArray(value) && value.length > 3) {
          return 'Maximo de 3 categorias por produto.'
        }
        return true
      },
    },
    {
      name: 'ecologico',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Fonte da verdade do eco (planilha). So as linhas Green sao ecologicas.',
      },
    },

    // Selos/icones (13 booleanos da planilha, bloco 3 do modelo).
    {
      name: 'selos',
      type: 'group',
      label: 'Selos e icones',
      admin: { description: 'Marcados com "OK" na planilha.' },
      fields: [
        { name: 'livreDeBpa', type: 'checkbox', label: 'Livre de BPA' },
        { name: 'usoMicroondas', type: 'checkbox', label: 'Uso em microondas' },
        { name: 'usoLavaLoucas', type: 'checkbox', label: 'Uso em lava-loucas' },
        { name: 'recicladoTotal', type: 'checkbox', label: 'Produto 100% reciclado' },
        { name: 'logisticaReversa', type: 'checkbox', label: 'Logistica reversa' },
        { name: 'usoPermanente', type: 'checkbox', label: 'Uso permanente' },
        { name: 'reducaoCo2', type: 'checkbox', label: 'Reducao de emissao de CO2' },
        { name: 'fonteRenovavel', type: 'checkbox', label: '50% fonte renovavel' },
        { name: 'designCircular', type: 'checkbox', label: 'Design circular' },
        { name: 'upcycling', type: 'checkbox', label: 'Upcycling' },
        { name: 'fibraNatural', type: 'checkbox', label: 'Fibra natural' },
        { name: 'reciclavel', type: 'checkbox', label: 'Produto reciclavel' },
        { name: 'reducaoPlastico', type: 'checkbox', label: 'Reducao de plastico' },
      ],
    },

    // Cores/variacoes. Cadastro manual ate a fonte de cor/tom do Plinio chegar.
    // A imagem por cor (troca ao selecionar) entra quando houver a convencao de
    // imagem casada ao codigo (ver modelo-produto.md secao 5).
    {
      name: 'cores',
      type: 'array',
      labels: { singular: 'Cor', plural: 'Cores' },
      fields: [
        { name: 'nome', type: 'text', required: true },
        {
          name: 'hex',
          type: 'text',
          admin: { description: 'Cor em hexadecimal, ex.: #1a2b3c (opcional).' },
        },
        { name: 'imagem', type: 'upload', relationTo: 'media', admin: { description: 'Foto na cor.' } },
      ],
    },

    // Midia. `imagens` e a galeria; `imagemAmbientada` e a foto lifestyle fixa.
    {
      name: 'imagens',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Galeria do produto. A primeira e a principal.' },
    },
    {
      name: 'imagemAmbientada',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagem ambientada (lifestyle)',
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video (URL)',
      admin: { description: 'Opcional. Link de video exibido na PDP.' },
    },

    // Logistica (informativa; definir na PDP o que e publico).
    {
      name: 'logistica',
      type: 'group',
      label: 'Logistica',
      fields: [
        { name: 'ncm', type: 'text', label: 'NCM' },
        { name: 'dimensoes', type: 'text', label: 'Dimensoes do produto' },
        { name: 'pesoUnitario', type: 'text', label: 'Peso unitario' },
        { name: 'materiaPrima', type: 'text', label: 'Materia prima' },
        { name: 'modeloCaixaMaster', type: 'text', label: 'Modelo caixa master' },
        { name: 'qtdPorCaixa', type: 'number', label: 'Quantidade por caixa' },
        { name: 'dimensoesCaixaMaster', type: 'text', label: 'Dimensoes da caixa master' },
        { name: 'pesoCaixaMaster', type: 'text', label: 'Peso da caixa master' },
      ],
    },

    // Impressao (metodos e areas).
    {
      name: 'impressao',
      type: 'group',
      label: 'Impressao',
      fields: [
        { name: 'metodos', type: 'text', label: 'Metodos de impressao' },
        { name: 'areaTransfer', type: 'text', label: 'Area de impressao (transfer)' },
        { name: 'areaTampografia', type: 'text', label: 'Area de impressao (tampografia)' },
        { name: 'areaSerigrafia', type: 'text', label: 'Area de impressao (serigrafia)' },
        { name: 'sleeve', type: 'text', label: 'Sleeve' },
      ],
    },

    // Visibilidade por canal (a planilha e mestre de varios canais).
    {
      name: 'canais',
      type: 'group',
      label: 'Canais / visibilidade',
      fields: [
        { name: 'site', type: 'checkbox', label: 'Publicar no site', defaultValue: true },
        { name: 'tabelaRevenda', type: 'checkbox', label: 'Tabela revenda' },
        { name: 'tabelaB2B', type: 'checkbox', label: 'Tabela B2B' },
      ],
    },

    // Faixa de preco publica e faixas de destaque na home.
    {
      name: 'faixaPreco',
      type: 'select',
      label: 'Faixa de preco (publica)',
      options: [
        { label: 'Ate R$ 3,99', value: 'ate-3-99' },
        { label: 'R$ 4 a R$ 15', value: '4-a-15' },
        { label: 'Acima de R$ 15', value: 'acima-de-15' },
      ],
      admin: { description: 'Faixa exibida no catalogo. O preco exato vem do CRM.' },
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

    // Preco/estoque: origem CRM (Leads2b) -> ERP. Placeholder ate a integracao.
    {
      name: 'crm',
      type: 'group',
      label: 'Dados do CRM/ERP',
      admin: {
        description:
          'Origem: CRM (Leads2b) -> ERP. Placeholder ate a integracao (S03-09). Nao editar como fonte da verdade.',
      },
      fields: [
        { name: 'preco', type: 'number', admin: { description: 'Preco unitario (BRL). Vem do CRM.' } },
        { name: 'estoque', type: 'number', admin: { description: 'Saldo em estoque. Vem do CRM.' } },
      ],
    },
  ],
}
