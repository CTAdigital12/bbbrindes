import type { MediaRef } from '../friendly/model'
// Tipos da collection `categorias` (grade estilo iFood na home + menu do catalogo).
// Espelham Categorias.ts e o leitor do front (content.ts getCategorias). Sem campo
// "ativo": a categoria aparece pela ordem/grupo; o icone e um upload (Media).
export type GrupoCategoria = 'ecologicos' | 'geral'
export type CategoriaDraft = {
  id?: number; nome: string; slug?: string; grupo?: GrupoCategoria; ordem?: number | null; icone?: MediaRef; updatedAt?: string
}
// Na lista cada linha carrega quantos produtos usam a categoria (contagem lida no servidor).
export type CategoriaRow = CategoriaDraft & { id: number; produtosCount?: number }
export type CategoriaIssue = { message: string; field?: string }
export const CATEGORIA_PATH = '/admin/collections/categorias'
export const GRUPO_OPTIONS: { value: GrupoCategoria; label: string }[] = [
  { value: 'ecologicos', label: 'Ecológicos' },
  { value: 'geral', label: 'Geral' },
]
export const grupoLabel = (grupo?: GrupoCategoria | null) => GRUPO_OPTIONS.find(option => option.value === grupo)?.label ?? 'Geral'
// Ecologicos no topo (como no site), depois Geral; dentro do grupo, ordem crescente e nome.
export const grupoRank = (grupo?: GrupoCategoria | null) => (grupo === 'ecologicos' ? 0 : 1)
