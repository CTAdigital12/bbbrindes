// Tipos do global `catalogos` (FB-6 midia). Espelham Catalogos.ts e o leitor do
// front (content.ts getCatalogos + types.ts CatalogoDigital). Tudo opcional: o
// front cai no mock por campo. itens = cards de atalho; url vazia abre o flipbook
// principal.
export type CatalogoItem = { id?: string; nome?: string; url?: string }
export type CatalogoContent = {
  titulo?: string
  intro?: string
  flipbookUrl?: string
  itens?: CatalogoItem[]
}
export const CATALOGOS_PATH = '/admin/globals/catalogos'
