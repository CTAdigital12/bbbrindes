// Tipos da collection `tags` (tags compartilhadas entre blog, cases e imprensa).
// Espelham Tags.ts e o uso nas tres collections (relationship hasMany). So dois
// campos: nome e slug (o slug e gerado do nome e fica protegido). Na lista, cada
// linha carrega em quantos conteudos a tag e usada (contagem lida no servidor).
export type TagDraft = { id?: number; nome: string; slug?: string; updatedAt?: string }
export type TagRow = TagDraft & { id: number; usosCount?: number }
export type TagIssue = { message: string; field?: string }
export const TAG_PATH = '/admin/collections/tags'
