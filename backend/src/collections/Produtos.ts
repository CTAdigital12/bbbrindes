import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'
import { CORES_BB } from '../components/produto/cores-bb'

// Produto do catalogo. Schema alinhado ao modelo validado com o Plinio
// (docs/modelo-produto.md, secoes 4 e 11) e a planilha real de produtos.
//
// Bloqueios ainda abertos (docs/modelo-produto.md secao 14), refletidos aqui:
// 1. Granularidade CL/PB indefinida: `codigoCigam` NAO e unique (233 CL e 233 PB
//    compartilham o mesmo CIGAM). `codigoSite` (comercial, ja com sufixo) e unique.
// 2. Cores (item A da revisao Plinio 10/11): a aba Cores usa a PALETA MESTRA da BB
//    (uma bolinha por cor, a pessoa so marca as que tem). O seletor (paleta) fica na
//    friendly view (src/admin/friendly/ProductColors.tsx) e grava no mesmo array
//    `cores` com um `codigo` opcional (tabela mestra do CRM). O dado segue compativel
//    com o site (cores[].nome/hex/imagem) e a foto-por-cor e preservada.
//
// Comercial / CRM (item E, CRITICO Leads2b): preco e estoque SAIRAM do cadastro (vem
// do CIGAM/CRM, nunca editados aqui). O que o site comunica ao CRM/ERP a cada
// orcamento e codigo CIGAM (produto) + codigo da COR; por isso o campo `ui`
// `codigosPorCor` mostra essa relacao read-only. Ver docs/integracao-leads2b.md.
export const Produtos: CollectionConfig = {
  slug: 'produtos',
  labels: { singular: 'Produto', plural: 'Produtos' },
  admin: {
    useAsTitle: 'nome',
    group: 'Catalogo',
    defaultColumns: ['nome', 'codigoSite', 'ecologico'],
    components: {
      // Item O: botao "carregar produtos em lote" + modelo CSV, acima da lista.
      beforeListTable: ['/components/produto/UploadLoteProdutos'],
      views: {
        list: { Component: '/admin/friendly/ProductsListView' },
        edit: { root: { Component: '/admin/friendly/ProductEditView' } },
      },
    },
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

    // Cores/variacoes (item A). A paleta mestra (bolinha por cor) marca quais cores o
    // produto tem; cada cor marcada vira uma entrada aqui. `codigo` e o codigo da
    // tabela mestra do CRM (alimenta o item E, codigos por cor). `nome`/`hex`/`imagem`
    // seguem como antes, para o site nao regredir e preservar a foto-por-cor.
    {
      name: 'cores',
      type: 'array',
      labels: { singular: 'Cor', plural: 'Cores' },
      fields: [
        { name: 'nome', type: 'text', required: true },
        {
          name: 'codigo',
          type: 'select',
          label: 'Codigo da cor (CRM)',
          options: CORES_BB.map((c) => ({ label: `${c.codigo} - ${c.nome}`, value: c.codigo })),
          admin: {
            description:
              'Codigo da cor na tabela mestra do CRM/Leads2b. Preenchido pela paleta; e o que vai no orcamento junto do CIGAM.',
          },
        },
        {
          name: 'hex',
          type: 'text',
          admin: { description: 'Cor em hexadecimal, ex.: #1a2b3c (opcional).' },
        },
        {
          name: 'imagem',
          type: 'upload',
          relationTo: 'media',
          filterOptions: { mimeType: { contains: 'image' } },
          admin: { description: 'Foto na cor.' },
        },
      ],
    },

    // Midia. `imagens` e a galeria; `imagemAmbientada` e a foto lifestyle fixa.
    {
      name: 'imagens',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      filterOptions: { mimeType: { contains: 'image' } },
      admin: { description: 'Galeria do produto. A primeira e a principal. Suba ou escolha da Media.' },
    },
    {
      name: 'imagemAmbientada',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagem ambientada (lifestyle)',
      filterOptions: { mimeType: { contains: 'image' } },
    },
    // Item C: imagem de dimensoes/medidas. O site abre esta imagem no "ver dimensoes"
    // do produto (botao da PDP). Diferente da ambientada (lifestyle).
    {
      name: 'imagemDimensoes',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagem de dimensoes',
      filterOptions: { mimeType: { contains: 'image' } },
      admin: {
        description:
          'Desenho/foto com as medidas do produto. Exibida no site em "ver dimensoes". Recomendado: imagem com cotas legiveis.',
      },
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

    // Impressao / personalizacao (item D). Primeiro marca-se o METODO disponivel
    // (checkbox); o campo de area/tamanho so aparece quando o metodo esta marcado
    // (admin.condition le o siblingData do grupo). `metodos` fica como texto livre
    // legado (observacoes), ainda lido pela friendly view.
    {
      name: 'impressao',
      type: 'group',
      label: 'Impressao',
      admin: {
        description:
          'Marque os metodos disponiveis; a area/tamanho de cada um abre so quando o metodo esta marcado.',
      },
      fields: [
        { name: 'metodoTransfer', type: 'checkbox', label: 'Transfer disponivel' },
        {
          name: 'areaTransfer',
          type: 'text',
          label: 'Area de impressao (transfer)',
          admin: { condition: (_, siblingData) => Boolean(siblingData?.metodoTransfer) },
        },
        { name: 'metodoTampografia', type: 'checkbox', label: 'Tampografia disponivel' },
        {
          name: 'areaTampografia',
          type: 'text',
          label: 'Area de impressao (tampografia)',
          admin: { condition: (_, siblingData) => Boolean(siblingData?.metodoTampografia) },
        },
        { name: 'metodoSerigrafia', type: 'checkbox', label: 'Serigrafia disponivel' },
        {
          name: 'areaSerigrafia',
          type: 'text',
          label: 'Area de impressao (serigrafia)',
          admin: { condition: (_, siblingData) => Boolean(siblingData?.metodoSerigrafia) },
        },
        { name: 'metodoSleeve', type: 'checkbox', label: 'Sleeve disponivel' },
        {
          name: 'sleeve',
          type: 'text',
          label: 'Sleeve (tamanho/area)',
          admin: { condition: (_, siblingData) => Boolean(siblingData?.metodoSleeve) },
        },
        {
          name: 'metodos',
          type: 'text',
          label: 'Metodos (texto livre, legado)',
          admin: { description: 'Observacoes de impressao em texto livre (compatibilidade).' },
        },
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

    // Quantidade minima de pedido (exibida na PDP). Antes era fixa no front
    // (MIN_QTD=500); agora e por produto, editavel no admin. Default 500 pra
    // nao regredir. O front le produto.quantidadeMinima com fallback em 500.
    {
      name: 'quantidadeMinima',
      type: 'number',
      label: 'Quantidade minima de pedido',
      defaultValue: 500,
      min: 1,
      admin: {
        description:
          'Minimo de unidades por pedido, exibido na PDP (ex.: "minimo 500 unidades"). Padrao 500.',
      },
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

    // Comercial / integracao CRM (item E, CRITICO Leads2b). Preco e estoque foram
    // REMOVIDOS do cadastro: vem do CIGAM/CRM, nunca editados aqui. O que o site
    // comunica ao CRM/ERP a cada orcamento e o codigo CIGAM (produto, na sidebar) +
    // o codigo da COR. O campo `ui` abaixo exibe essa relacao (read-only), montando
    // CIGAM + codigo de cada cor marcada. Ver docs/integracao-leads2b.md.
    {
      name: 'codigosPorCor',
      type: 'ui',
      label: 'Codigos por cor (CRM / Leads2b)',
      admin: {
        components: {
          Field: '/components/produto/CodigosPorCorField',
        },
      },
    },
  ],
}
