import { RequestError } from '../friendly/api-errors'
import type { CatalogoContent, CatalogoItem } from './catalogos-model'
export type CatalogoIssue = { message: string; field?: string }
// Aceita so link http(s): a URL do flipbook vai num <iframe> e o card abre em nova
// aba. Vazio e valido (o card sem url cai no flipbook principal).
export function isHttpUrl(value?: string): boolean {
  const v = (value ?? '').trim()
  if (!v) return true
  return /^https?:\/\/\S+$/i.test(v)
}
const item = (row: CatalogoItem) => ({ ...(row.id ? { id: row.id } : {}), nome: row.nome ?? '', url: (row.url ?? '').trim() })
// Corpo do update do global: manda TODOS os campos (estado completo carregado),
// preservando o id das linhas dos cards.
export function catalogosBody(cat: CatalogoContent): Record<string, unknown> {
  return {
    titulo: cat.titulo ?? '',
    intro: cat.intro ?? '',
    flipbookUrl: (cat.flipbookUrl ?? '').trim(),
    itens: (cat.itens ?? []).map(item),
  }
}
// Valida o obrigatorio do schema (nome do card) e, como ajuda, checa que as URLs
// (flipbook e cards) sejam links http validos.
export function validateCatalogos(cat: CatalogoContent): CatalogoIssue | undefined {
  if ((cat.itens ?? []).some(i => !i.nome?.trim())) return { message: 'Em Cards de catálogo, preencha o nome de todos os itens (ou remova os vazios).', field: 'itens' }
  if (!isHttpUrl(cat.flipbookUrl)) return { message: 'A URL do flipbook deve começar com http:// ou https://.', field: 'flipbookUrl' }
  if ((cat.itens ?? []).some(i => !isHttpUrl(i.url))) return { message: 'Confira os links dos cards: use http:// ou https:// (ou deixe em branco).', field: 'itens' }
  return undefined
}
export function catalogosSaveIssue(cause: unknown): CatalogoIssue {
  if (cause instanceof RequestError && cause.fields.length) return { message: 'Confira os campos e tente salvar novamente.' }
  return { message: cause instanceof Error ? cause.message : 'Não foi possível salvar. Tente novamente.' }
}
