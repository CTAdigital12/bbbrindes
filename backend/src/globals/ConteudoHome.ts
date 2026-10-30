import type { GlobalConfig } from 'payload'

import { rebuildGlobalAfterChange } from '../hooks/triggerDeploy'

// Global "Conteudo da home" (FB-6, Fase 5). Torna editavel no /admin a COPY dos
// blocos da home que hoje sao hardcoded no front (frontend/src/data/home-joy.ts e
// blocos inline em app/page.tsx): selos de confianca, diferenciais, depoimentos,
// FAQ, bloco de urgencia, blocos eco (banner + lead) e o CTA final.
//
// Nasce ja preenchido com os valores que estao no ar (via `defaultValue`), com os
// ACENTOS corretos (igual ao site), entao NAO precisa de seed. O front le este
// global com fallback no mock. Escopo = texto/copy; imagens dos blocos e countdown
// seguem no front por ora.

export const ConteudoHome: GlobalConfig = {
  slug: 'conteudo-home',
  label: 'Conteudo da home',
  admin: {
    group: 'Conteudo',
    description:
      'Textos dos blocos da home (selos, diferenciais, depoimentos, FAQ, urgencia, eco, CTA final). Os icones usam o nome do arquivo SVG em /img/icones (ex.: para diferenciais, o arquivo e diferencial-<icone>.svg).',
  },
  access: {
    read: () => true,
  },
  // Editar a home no admin dispara rebuild do site estatico (FB-6: editavel tem
  // que refletir sem dev). Mesmo hook do global `configuracoes`.
  hooks: {
    afterChange: [rebuildGlobalAfterChange],
  },
  fields: [
    {
      name: 'selosConfianca',
      type: 'array',
      label: 'Selos de confianca (faixa de 4)',
      admin: { description: 'Icone = nome do icone (ex.: building-factory-2, package, truck-delivery, certificate).' },
      defaultValue: [
        { icone: 'building-factory-2', titulo: 'Fábrica própria há 27 anos', sub: 'Do molde à entrega, sem intermediário' },
        { icone: 'package', titulo: 'A partir de 500 unidades', sub: 'Do pedido de evento ao volume nacional' },
        { icone: 'truck-delivery', titulo: 'Entrega para todo o Brasil', sub: 'Prazo combinado no orçamento' },
        { icone: 'certificate', titulo: 'Qualidade certificada', sub: 'SGP, GMP, NM300 e SMETA' },
      ],
      fields: [
        { name: 'icone', type: 'text', required: true },
        { name: 'titulo', type: 'text', required: true },
        { name: 'sub', type: 'text' },
      ],
    },
    {
      name: 'diferenciais',
      type: 'array',
      label: 'Diferenciais',
      admin: { description: 'Icone = slug do arquivo diferencial-<icone>.svg em /img/icones.' },
      defaultValue: [
        { icone: 'industria-brasileira', titulo: 'Indústria brasileira', sub: 'Produção nacional, do molde à entrega' },
        { icone: 'melhor-custo-beneficio', titulo: 'Melhor custo-benefício', sub: 'Preço de fábrica, sem intermediário' },
        { icone: 'entrega-garantida', titulo: 'Entrega garantida', sub: 'Prazo combinado e acompanhado' },
        { icone: 'industria-sustentavel', titulo: 'Indústria sustentável', sub: 'Fibras naturais de coco e madeira de reflorestamento' },
        { icone: 'atoxidade-certificada', titulo: 'Atoxidade certificada', sub: 'Para itens com contato com alimento' },
        { icone: 'cores-inovadoras', titulo: 'Cores inovadoras', sub: 'Linhas Colors para combinar com a sua marca' },
        { icone: 'qualidade-certificada', titulo: 'Qualidade certificada', sub: 'SGP, PS&C, GMP, NM300 e SMETA 4 Pilares' },
        { icone: 'livre-de-bpa', titulo: 'Livre de BPA', sub: 'Seguro para o uso diário' },
        { icone: 'microondas-e-lava-loucas', titulo: 'Microondas e lava-louças', sub: 'Uso permanente, não descartável' },
      ],
      fields: [
        { name: 'icone', type: 'text', required: true },
        { name: 'titulo', type: 'text', required: true },
        { name: 'sub', type: 'text' },
      ],
    },
    {
      name: 'depoimentos',
      type: 'array',
      label: 'Depoimentos',
      defaultValue: [
        { texto: '“Vocês foram brilhantes. Os brindes ficaram lindos. Cumpriram os prazos com excelência.”', autor: 'Lilian Bueno · Braskem' },
        { texto: '“O produto que recebi é de excelente qualidade e o pedido foi entregue corretamente, antes mesmo do combinado.”', autor: 'Wilson Dias Lima · TOP Fitness' },
      ],
      fields: [
        { name: 'texto', type: 'textarea', required: true },
        { name: 'autor', type: 'text', required: true },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      label: 'Perguntas frequentes (FAQ)',
      defaultValue: [
        { pergunta: 'Qual é o pedido mínimo?', resposta: 'A maioria dos produtos é personalizada a partir de 500 unidades. O especialista confirma o mínimo de cada item no orçamento.' },
        { pergunta: 'Com quanto tempo de antecedência preciso fechar?', resposta: 'Recomendamos fechar com 40 a 60 dias de antecedência. Para o Natal, o ideal é fechar até o fim de outubro, porque a produção de fim de ano é o pico do setor.' },
        { pergunta: 'Como a minha marca é aplicada?', resposta: 'Por transfer ou serigrafia, conforme o produto. A área de impressão de cada item está na página do produto.' },
        { pergunta: 'Os produtos são atóxicos?', resposta: 'Os itens com contato com alimento (copos, canecas, squeezes e bowls) têm atoxidade certificada e são livres de BPA.' },
        { pergunta: 'Vocês entregam em todo o Brasil?', resposta: 'Sim. A BB Brindes, empresa do Grupo BB, fabrica no Brasil e entrega para todo o país.' },
      ],
      fields: [
        { name: 'pergunta', type: 'text', required: true },
        { name: 'resposta', type: 'textarea', required: true },
      ],
    },
    {
      name: 'urgencia',
      type: 'group',
      label: 'Bloco de urgencia (agenda de fim de ano)',
      admin: { description: 'O countdown segue no front; a copy e a imagem sao editaveis aqui.' },
      fields: [
        { name: 'chip', type: 'text', defaultValue: 'Agenda de fim de ano' },
        { name: 'tituloInicio', type: 'text', defaultValue: 'Dezembro tem prazo.', admin: { description: 'Parte normal do titulo.' } },
        { name: 'tituloDestaque', type: 'text', defaultValue: 'A produção do seu brinde também.', admin: { description: 'Parte destacada (verde lime).' } },
        { name: 'texto', type: 'textarea', defaultValue: 'A produção de fim de ano é o pico do setor. Feche seu pedido de Natal até o fim de outubro e garanta a entrega antes das festas.' },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Garantir meu prazo' },
        { name: 'ctaHref', type: 'text', defaultValue: '/campanha/natal' },
        { name: 'imagem', type: 'upload', relationTo: 'media', admin: { description: 'Foto do bloco. Vazio = usa a imagem padrao do site.' } },
      ],
    },
    {
      name: 'ecoBanner',
      type: 'group',
      label: 'Banner eco (Linha Green)',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Linha Green' },
        { name: 'titulo', type: 'text', defaultValue: 'A nova geração dos brindes ecológicos' },
        { name: 'texto', type: 'text', defaultValue: 'Mais design. Menos impacto. Mais futuro.' },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Ver linha ecológica' },
        { name: 'imagem', type: 'upload', relationTo: 'media', admin: { description: 'Imagem de fundo do banner eco. Vazio = usa a imagem padrao do site.' } },
      ],
    },
    {
      name: 'ecoLead',
      type: 'group',
      label: 'Bloco eco (destaque escuro)',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Brindes ecológicos' },
        { name: 'titulo', type: 'text', defaultValue: 'Brindes que duram, não descartáveis' },
        { name: 'texto', type: 'textarea', defaultValue: 'Fabricados com fibras naturais de coco e madeira de reflorestamento. Produto reciclável, de uso permanente, livre de BPA.' },
        {
          name: 'linhas',
          type: 'array',
          label: 'Selos/linhas',
          defaultValue: [
            { texto: 'Premium' },
            { texto: 'Green Fibras' },
            { texto: 'Green Plasticaria' },
            { texto: 'Green Reversa' },
          ],
          fields: [{ name: 'texto', type: 'text', required: true }],
        },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Ver linha ecológica' },
        { name: 'imagem', type: 'upload', relationTo: 'media', admin: { description: 'Foto do bloco eco escuro. Vazio = usa a imagem padrao do site.' } },
      ],
    },
    {
      name: 'ctaFinal',
      type: 'group',
      label: 'CTA final',
      fields: [
        { name: 'titulo', type: 'textarea', defaultValue: 'Monte seu orçamento. Um especialista responde com a proposta.' },
        { name: 'texto', type: 'textarea', defaultValue: 'Sem pagamento online. Você escolhe os produtos e a quantidade, e o time comercial retorna.' },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Começar meu orçamento' },
        { name: 'ctaHref', type: 'text', defaultValue: '/catalogo' },
      ],
    },
  ],
}
