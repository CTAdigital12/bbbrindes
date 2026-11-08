import type { MediaRef } from '../friendly/model'
// Tipos da collection `depoimentos` (home e pagina de cases). Espelham Depoimentos.ts.
// Sem slug. foto e upload (Media); ordem define a sequencia; ativo liga/desliga.
export type DepoimentoDraft = {
  id?: number; texto: string; autor: string; empresa?: string; foto?: MediaRef;
  ordem?: number | null; ativo?: boolean | null; updatedAt?: string
}
export type DepoimentoRow = DepoimentoDraft & { id: number }
export type DepoimentoIssue = { message: string; field?: string }
export const DEPOIMENTO_PATH = '/admin/collections/depoimentos'
// "Autor, Empresa" como o site mostra (empresa opcional).
export const depoimentoFonte = (d: DepoimentoDraft): string =>
  [d.autor.trim(), d.empresa?.trim()].filter(Boolean).join(', ')
