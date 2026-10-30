import type { CollectionConfig } from 'payload'

// Collection dos banners do carrossel principal da home (FB-6 midia). Substitui o
// hardcode de frontend/src/data/home-joy.ts (MESES + FIXOS + orderedHeroSlides).
//
// Modelo: cada slide e `mensal` (1 por mes, 1..12, entra na rotacao por mes) ou
// `fixo` (sempre exibido entre os meses). A rotacao (mes corrente primeiro, depois
// os fixos, depois os demais meses) continua no FRONT, no build; aqui so guardamos
// os slides + a classificacao. O titulo e quebrado em 3 partes (antes/destaque/
// depois) porque o destaque e renderizado com cor lime (<span class="hl">); o front
// recompoe e aplica o anti-viuva. As imagens apontam pra Media (R2 + webp).
export const HeroSlides: CollectionConfig = {
  slug: 'hero-slides',
  labels: { singular: 'Banner do hero', plural: 'Banners do hero' },
  admin: {
    group: 'Conteudo',
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'tipo', 'mes', 'ordem', 'ativo'],
    description:
      'Carrossel principal da home. "Mensal" rotaciona (1 por mes, campo Mes 1-12); "Fixo" aparece sempre entre os meses. O destaque do titulo sai em verde lime.',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'ordem',
  fields: [
    { name: 'nome', type: 'text', required: true, admin: { description: 'Nome interno (ex.: "Janeiro - Volta as aulas").' } },
    {
      name: 'tipo',
      type: 'select',
      required: true,
      defaultValue: 'mensal',
      options: [
        { label: 'Mensal (rotaciona)', value: 'mensal' },
        { label: 'Fixo (sempre entre os meses)', value: 'fixo' },
      ],
    },
    {
      name: 'mes',
      type: 'number',
      min: 1,
      max: 12,
      admin: {
        description: 'Mes do banner (1 = janeiro ... 12 = dezembro). So para o tipo Mensal.',
        condition: (data) => data?.tipo === 'mensal',
      },
    },
    { name: 'ordem', type: 'number', defaultValue: 0, admin: { description: 'Ordem entre os fixos / desempate (menor primeiro).' } },
    { name: 'ativo', type: 'checkbox', defaultValue: true },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'Escuro', value: 'dark' },
        { label: 'Creme', value: 'cream' },
      ],
    },
    { name: 'tag', type: 'text', required: true, admin: { description: 'Etiqueta pequena acima do titulo (ex.: "Carnaval").' } },
    { name: 'icone', type: 'text', admin: { description: 'Nome do icone (ex.: sun, sparkles, droplet, heart, leaf).' } },
    { name: 'tituloAntes', type: 'text', admin: { description: 'Parte do titulo antes do destaque.' } },
    { name: 'tituloDestaque', type: 'text', admin: { description: 'Parte destacada do titulo (verde lime).' } },
    { name: 'tituloDepois', type: 'text', admin: { description: 'Parte do titulo depois do destaque (pode ficar vazia).' } },
    { name: 'sub', type: 'textarea' },
    { name: 'ctaLabel', type: 'text' },
    { name: 'ctaHref', type: 'text' },
    { name: 'imagemDesktop', type: 'upload', relationTo: 'media', admin: { description: 'Imagem de fundo (desktop). Vazio = usa a imagem padrao do site.' } },
    { name: 'imagemMobile', type: 'upload', relationTo: 'media', admin: { description: 'Imagem de fundo (mobile). Vazio = usa a imagem padrao do site.' } },
  ],
}
