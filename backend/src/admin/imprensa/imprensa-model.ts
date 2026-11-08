// Tipos da collection `imprensa` (clipping / materias). Espelham Imprensa.ts e o
// leitor do front (lib/content.ts getMaterias + pagina /imprensa). resumo e
// textarea (texto puro), data e campo date, url e o link externo da materia.
// Sem slug nesta collection (o site identifica por id). tags e relationship
// hasMany (so exibidas como chips, sem seletor novo).
export type Tag = { id: number; nome: string; slug?: string }
export type ImprensaDraft = {
  id?: number; titulo: string; veiculo: string; data?: string | null;
  resumo?: string | null; url?: string | null; tags?: (Tag | number)[]; updatedAt?: string;
}
export type ImprensaRow = ImprensaDraft & { id: number }
export type ImprensaIssue = { message: string; field?: string }
export const IMPRENSA_PATH = '/admin/collections/imprensa'
