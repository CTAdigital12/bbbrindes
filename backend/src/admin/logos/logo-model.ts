// Tipos da collection `logos` (marquee da home). E uma colecao de UPLOAD: o proprio
// documento guarda o arquivo (url/filename) alem de nome e ordem. Sem slug e sem
// Media separada (o SVG/PNG nao passa pela conversao da Media; mantem o vetor).
export type LogoDraft = {
  id?: number; nome: string; ordem?: number | null; url?: string | null; filename?: string | null; updatedAt?: string
}
export type LogoRow = LogoDraft & { id: number }
export type LogoIssue = { message: string; field?: string }
export const LOGO_PATH = '/admin/collections/logos'
export const LOGO_ACCEPT = 'image/svg+xml,image/png,image/webp'
