import type { MediaRef } from '../friendly/model'
// Tipos do global `conteudo-institucional` (FB-6 Fase 6). Espelham
// ConteudoInstitucional.ts e o leitor do front (content.ts getConteudoInstitucional).
// Tudo opcional: um bloco vazio nao quebra. As imagens (fotoFabrica e cada foto da
// galeria) sao MediaRef (objeto com url em depth>=1, ou id/null).
export type InstNumero = { id?: string; valor?: string; rotulo?: string }
export type InstSustentabilidade = { id?: string; icone?: string; titulo?: string }
export type InstSelo = { id?: string; sigla?: string; desc?: string }
export type InstGaleria = { id?: string; imagem?: MediaRef; legenda?: string }
export type InstQuemSomos = {
  eyebrow?: string; titulo?: string; paragrafo1?: string; paragrafo2?: string;
  numeros?: InstNumero[]; sustentabilidade?: InstSustentabilidade[]; selos?: InstSelo[];
  fotoFabrica?: MediaRef; galeria?: InstGaleria[];
}
export type InstMotivo = { id?: string; texto?: string }
export type InstSac = { titulo?: string; texto?: string; motivos?: InstMotivo[] }
export type InstMarco = { id?: string; ano?: string; titulo?: string; texto?: string; destaqueResumo?: boolean }
export type InstitucionalContent = {
  quemSomos?: InstQuemSomos; sac?: InstSac; linhaDoTempo?: InstMarco[];
}
export type InstitucionalIssue = { message: string }
export const INSTITUCIONAL_PATH = '/admin/globals/conteudo-institucional'
// Sustentabilidade: o site desenha o arquivo /img/icones/sustentabilidade-<icone>.svg.
// Slugs que ja existem no site (a Joy entrega o SVG para criar novos). E so uma
// sugestao: o campo e texto livre, da para digitar um slug novo.
export const SUSTENTABILIDADE_ICON_OPTIONS: string[] = [
  'livres-de-bpa-e-reciclados', 'menos-plastico-virgem', 'controle-de-qualidade',
]
