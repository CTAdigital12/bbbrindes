import type { MediaRef, Product } from '../friendly/model'
// Tipos da collection `campanhas` (datas/acoes do site). Espelham Campanhas.ts e o
// leitor do front (lib/campanhas.ts). conteudo e richText (lexical); na tela e
// editado como texto e convertido no salvar (igual a descricao do produto).
export type CampanhaDraft = {
  id?: number; nome: string; slug?: string; mes?: string | null; chamada?: string | null;
  imagem?: MediaRef; conteudo?: unknown; produtos?: (Product | number)[]; ativo?: boolean | null; updatedAt?: string;
}
export type CampanhaRow = CampanhaDraft & { id: number }
export type CampanhaIssue = { message: string; field?: string }
export const CAMPANHA_PATH = '/admin/collections/campanhas'
// Meses sugeridos (o campo e texto livre; aceita periodo tipo "Festas juninas").
export const MES_OPTIONS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
