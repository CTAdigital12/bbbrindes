import type { MediaRef } from '../friendly/model'
// Tipos da collection `cases` (prova social). Espelham Cases.ts e o leitor do
// front (lib/content.ts getCases + CasesHome). resumo e depoimento.texto sao
// textarea (texto puro, NAO richText). logo/imagem sao uploads (Media), hoje nao
// usados no card do site (decisao 27/10: faixa de marca com o nome do cliente).
// tags e relationship hasMany (so exibidas como chips, sem seletor novo).
export type Tag = { id: number; nome: string; slug?: string }
export type Depoimento = { texto?: string | null; autor?: string | null }
export type CaseDraft = {
  id?: number; cliente: string; titulo: string; slug?: string;
  segmento?: string | null; resumo?: string | null;
  logo?: MediaRef; imagem?: MediaRef; depoimento?: Depoimento;
  tags?: (Tag | number)[]; updatedAt?: string;
}
export type CaseRow = CaseDraft & { id: number }
export type CaseIssue = { message: string; field?: string }
export const CASE_PATH = '/admin/collections/cases'
