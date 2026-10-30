import type { GlobalConfig } from 'payload'

// Global "Conteudo da home" (FB-6, Fase 5). Torna editavel no /admin a COPY dos
// blocos da home que hoje sao hardcoded no front (frontend/src/data/home-joy.ts e
// blocos inline em app/page.tsx): selos de confianca, diferenciais, depoimentos,
// FAQ, bloco de urgencia, blocos eco (banner + lead) e o CTA final.
//
// Nasce ja preenchido com os valores que estao no ar (via `defaultValue` em cada
// campo), entao NAO precisa de script de seed: ao abrir no admin / ler pela API, o
// global ja vem com o conteudo atual. O front deve ler este global com fallback no
// mock (home-joy.ts) pra nao regredir no build. Escopo = texto/copy; as imagens
// dos blocos (urgencia/eco) e o countdown seguem no front por ora.

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
  fields: [
    {
      name: 'selosConfianca',
      type: 'array',
      label: 'Selos de confianca (faixa de 4)',
      admin: { description: 'Icone = nome do icone (ex.: building-factory-2, package, truck-delivery, certificate).' },
      defaultValue: [
        { icone: 'building-factory-2', titulo: 'Fabrica propria ha 27 anos', sub: 'Do molde a entrega, sem intermediario' },
        { icone: 'package', titulo: 'A partir de 500 unidades', sub: 'Do pedido de evento ao volume nacional' },
        { icone: 'truck-delivery', titulo: 'Entrega para todo o Brasil', sub: 'Prazo combinado no orcamento' },
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
        { icone: 'industria-brasileira', titulo: 'Industria brasileira', sub: 'Producao nacional, do molde a entrega' },
        { icone: 'melhor-custo-beneficio', titulo: 'Melhor custo-beneficio', sub: 'Preco de fabrica, sem intermediario' },
        { icone: 'entrega-garantida', titulo: 'Entrega garantida', sub: 'Prazo combinado e acompanhado' },
        { icone: 'industria-sustentavel', titulo: 'Industria sustentavel', sub: 'Fibras naturais de coco e madeira de reflorestamento' },
        { icone: 'atoxidade-certificada', titulo: 'Atoxidade certificada', sub: 'Para itens com contato com alimento' },
        { icone: 'cores-inovadoras', titulo: 'Cores inovadoras', sub: 'Linhas Colors para combinar com a sua marca' },
        { icone: 'qualidade-certificada', titulo: 'Qualidade certificada', sub: 'SGP, PS&C, GMP, NM300 e SMETA 4 Pilares' },
        { icone: 'livre-de-bpa', titulo: 'Livre de BPA', sub: 'Seguro para o uso diario' },
        { icone: 'microondas-e-lava-loucas', titulo: 'Microondas e lava-loucas', sub: 'Uso permanente, nao descartavel' },
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
        { texto: '"Voces foram brilhantes. Os brindes ficaram lindos. Cumpriram os prazos com excelencia."', autor: 'Lilian Bueno - Braskem' },
        { texto: '"O produto que recebi e de excelente qualidade e o pedido foi entregue corretamente, antes mesmo do combinado."', autor: 'Wilson Dias Lima - TOP Fitness' },
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
        { pergunta: 'Qual e o pedido minimo?', resposta: 'A maioria dos produtos e personalizada a partir de 500 unidades. O especialista confirma o minimo de cada item no orcamento.' },
        { pergunta: 'Com quanto tempo de antecedencia preciso fechar?', resposta: 'Recomendamos fechar com 40 a 60 dias de antecedencia. Para o Natal, o ideal e fechar ate o fim de outubro, porque a producao de fim de ano e o pico do setor.' },
        { pergunta: 'Como a minha marca e aplicada?', resposta: 'Por transfer ou serigrafia, conforme o produto. A area de impressao de cada item esta na pagina do produto.' },
        { pergunta: 'Os produtos sao atoxicos?', resposta: 'Os itens com contato com alimento (copos, canecas, squeezes e bowls) tem atoxidade certificada e sao livres de BPA.' },
        { pergunta: 'Voces entregam em todo o Brasil?', resposta: 'Sim. A BB Brindes, empresa do Grupo BB, fabrica no Brasil e entrega para todo o pais.' },
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
      admin: { description: 'O countdown e a imagem seguem no front; aqui e so a copy.' },
      fields: [
        { name: 'chip', type: 'text', defaultValue: 'Agenda de fim de ano' },
        { name: 'tituloInicio', type: 'text', defaultValue: 'Dezembro tem prazo.', admin: { description: 'Parte normal do titulo.' } },
        { name: 'tituloDestaque', type: 'text', defaultValue: 'A producao do seu brinde tambem.', admin: { description: 'Parte destacada (verde lime).' } },
        { name: 'texto', type: 'textarea', defaultValue: 'A producao de fim de ano e o pico do setor. Feche seu pedido de Natal ate o fim de outubro e garanta a entrega antes das festas.' },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Garantir meu prazo' },
        { name: 'ctaHref', type: 'text', defaultValue: '/campanha/natal' },
      ],
    },
    {
      name: 'ecoBanner',
      type: 'group',
      label: 'Banner eco (Linha Green)',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Linha Green' },
        { name: 'titulo', type: 'text', defaultValue: 'A nova geracao dos brindes ecologicos' },
        { name: 'texto', type: 'text', defaultValue: 'Mais design. Menos impacto. Mais futuro.' },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Ver linha ecologica' },
      ],
    },
    {
      name: 'ecoLead',
      type: 'group',
      label: 'Bloco eco (destaque escuro)',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Brindes ecologicos' },
        { name: 'titulo', type: 'text', defaultValue: 'Brindes que duram, nao descartaveis' },
        { name: 'texto', type: 'textarea', defaultValue: 'Fabricados com fibras naturais de coco e madeira de reflorestamento. Produto reciclavel, de uso permanente, livre de BPA.' },
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
        { name: 'ctaLabel', type: 'text', defaultValue: 'Ver linha ecologica' },
      ],
    },
    {
      name: 'ctaFinal',
      type: 'group',
      label: 'CTA final',
      fields: [
        { name: 'titulo', type: 'textarea', defaultValue: 'Monte seu orcamento. Um especialista responde com a proposta.' },
        { name: 'texto', type: 'textarea', defaultValue: 'Sem pagamento online. Voce escolhe os produtos e a quantidade, e o time comercial retorna.' },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Comecar meu orcamento' },
        { name: 'ctaHref', type: 'text', defaultValue: '/catalogo' },
      ],
    },
  ],
}
