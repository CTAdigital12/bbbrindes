import type { MediaRef } from '../friendly/model'
// Tipos do global `conteudo-home` (FB-6 Fase 5). Espelham ConteudoHome.ts e o
// leitor do front (content.ts getConteudoHome). Tudo opcional: um bloco vazio
// nao quebra. As imagens sao MediaRef (objeto com url em depth>=1, ou id/null).
export type HomeItem = { icone?: string; titulo?: string; sub?: string }
export type HomeQuote = { texto?: string; autor?: string }
export type HomeFaq = { pergunta?: string; resposta?: string }
export type HomeUrgencia = { chip?: string; tituloInicio?: string; tituloDestaque?: string; texto?: string; ctaLabel?: string; ctaHref?: string; imagem?: MediaRef }
export type HomeEcoBanner = { eyebrow?: string; titulo?: string; texto?: string; ctaLabel?: string; imagem?: MediaRef }
export type HomeEcoLead = { eyebrow?: string; titulo?: string; texto?: string; linhas?: { texto?: string }[]; ctaLabel?: string; imagem?: MediaRef }
export type HomeCtaFinal = { titulo?: string; texto?: string; ctaLabel?: string; ctaHref?: string }
export type HomeContent = {
  selosConfianca?: HomeItem[]; diferenciais?: HomeItem[]; depoimentos?: HomeQuote[]; faq?: HomeFaq[];
  urgencia?: HomeUrgencia; ecoBanner?: HomeEcoBanner; ecoLead?: HomeEcoLead; ctaFinal?: HomeCtaFinal;
}
export const HOME_PATH = '/admin/globals/conteudo-home'
// Selos de confianca: o site desenha pelo nome do icone (componente Icon do front).
// Lista curada dos nomes mais uteis para a faixa de confianca.
export const SELO_ICON_OPTIONS: [value: string, label: string][] = [
  ['building-factory-2', 'Fábrica'], ['package', 'Pacote'], ['truck-delivery', 'Entrega'],
  ['certificate', 'Certificado'], ['shield-check', 'Garantia'], ['award', 'Prêmio'],
  ['medal', 'Medalha'], ['recycle', 'Reciclável'], ['leaf', 'Folha'], ['clock', 'Prazo'],
  ['coin', 'Preço'], ['headset', 'Atendimento'], ['briefcase', 'Corporativo'], ['check', 'Confirmação'],
]
// Diferenciais: o site usa o arquivo /img/icones/diferencial-<slug>.svg. Slugs que
// ja existem no site (a Joy entrega o SVG para criar novos).
export const DIF_ICON_OPTIONS: string[] = [
  'industria-brasileira', 'melhor-custo-beneficio', 'entrega-garantida', 'industria-sustentavel',
  'atoxidade-certificada', 'cores-inovadoras', 'qualidade-certificada', 'livre-de-bpa', 'microondas-e-lava-loucas',
]
