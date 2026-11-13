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
// Dimensao recomendada da arte da campanha (item F). O site mostra o lado DIREITO da
// imagem (no card da home e no topo da pagina, object-position right center), entao o
// produto deve ficar a direita. Valor em um lugar so pra casar o hint do upload com a previa.
export const CAMPANHA_IMG_DIM = '1600 × 600 px'
export const CAMPANHA_IMG_HINT = `Dimensão recomendada: ${CAMPANHA_IMG_DIM} (paisagem larga). Aparece no card da home e no topo da página; o site mostra o lado direito, então deixe o produto à direita. Vazio usa um fundo verde.`
// Meses sugeridos (o campo e texto livre; aceita periodo tipo "Festas juninas").
export const MES_OPTIONS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
