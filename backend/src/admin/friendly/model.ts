export type Media = { id: number; url?: string | null; filename?: string | null; alt?: string | null; createdAt?: string; updatedAt?: string }
export type MediaRef = Media | number | null
export type Category = { id: number; nome: string; slug?: string; icone?: MediaRef }
// `codigo` = codigo da cor na tabela mestra do CRM/Leads2b (item A/E da revisao
// Plinio). Opcional: entradas antigas (texto livre) podem nao ter, e o site resolve
// pelo nome. A paleta (ProductColors) preenche o codigo ao marcar a cor.
export type ProductColor = { id?: string; nome: string; hex?: string | null; imagem?: MediaRef; codigo?: string | null }
// Item 5 (cores base x acessorio, group `variacao` do schema #181). O bloco base
// reusa o array `cores` do produto; o acessorio tem a propria lista `coresAcessorio`
// (mesma forma de ProductColor). Cada bloco tem rotulo (ex. "Garrafa"/"Tampa") e a
// flag "nao preencher" (bloco sem cor -> codigo ...00 naquela metade).
export type Variacao = {
  baseRotulo?: string | null; baseNaoPreencher?: boolean | null;
  acessorioRotulo?: string | null; acessorioNaoPreencher?: boolean | null;
  coresAcessorio?: ProductColor[];
}
export type Product = {
  id?: number; nome: string; slug?: string; codigoSite: string; codigoCigam?: string;
  subtitulo?: string; headline?: string; descricaoCurta?: string; descricaoCompleta?: unknown;
  beneficios?: string[]; idealPara?: string[]; diferenciais?: string[];
  categorias?: (Category | number)[]; ecologico?: boolean; quantidadeMinima?: number | null;
  imagens?: MediaRef[]; imagemAmbientada?: MediaRef; imagemDimensoes?: MediaRef; cores?: ProductColor[]; variacao?: Variacao; videoUrl?: string;
  selos?: Record<string, boolean | null>; seo?: Record<string, unknown>;
  especificacoes?: { id?: string; rotulo: string; valor: string }[];
  logistica?: Record<string, unknown>; impressao?: Record<string, unknown>;
  canais?: { site?: boolean | null; tabelaRevenda?: boolean; tabelaB2B?: boolean };
  crm?: { preco?: number | null; estoque?: number | null };
  argumentoComercial?: string; faixaPreco?: string; destaques?: string[]; updatedAt?: string;
}
export type Banner = { id: number; nome: string; tipo?: string; mes?: number | null; ativo?: boolean | null; imagemDesktop?: MediaRef; imagemMobile?: MediaRef; updatedAt?: string }
export const SITE_URL = 'https://ctadigital12.github.io/bbbrindes'
export const photo = (value: MediaRef | undefined): Media | undefined => value && typeof value === 'object' ? value : undefined
export const mediaID = (value: MediaRef | undefined): number | undefined => typeof value === 'number' ? value : value?.id
export const categoryIDs = (product: Product) => (product.categorias ?? []).map(category => typeof category === 'number' ? category : category.id)
export const published = (product: Product) => product.canais?.site !== false
export const missingPhoto = (product: Product) => !product.imagens?.some(image => Boolean(mediaID(image)))
export function displayName(email?: string) {
  const first = (email ?? '').split('@')[0].split(/[._-]/)[0]
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : 'Usuário'
}
export function dateLabel(value?: string) {
  return value ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short' }).format(new Date(value)) : 'Ainda não salvo'
}
