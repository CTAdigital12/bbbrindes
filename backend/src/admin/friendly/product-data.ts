import { mediaID, type Product } from './model'
const editable = ['nome', 'codigoSite', 'codigoCigam', 'subtitulo', 'headline', 'descricaoCurta', 'descricaoCompleta', 'beneficios', 'idealPara', 'diferenciais', 'categorias', 'ecologico', 'quantidadeMinima', 'imagens', 'imagemAmbientada', 'cores', 'videoUrl', 'selos', 'seo', 'especificacoes', 'logistica', 'impressao', 'canais', 'argumentoComercial', 'faixaPreco', 'destaques'] as const
export function plainText(value: unknown): string {
  if (typeof value === 'string') return value
  const node = value as { text?: string; root?: { children?: unknown[] }; children?: unknown[] } | null
  if (!node) return ''
  if (typeof node.text === 'string') return node.text
  return (node.root?.children ?? node.children ?? []).map(plainText).join(node.root ? '\n\n' : '')
}
export function richText(value: string) {
  return { root: { type: 'root', format: '', indent: 0, version: 1, direction: 'ltr', children: value.split(/\n\n+/).map(text => ({ type: 'paragraph', format: '', indent: 0, version: 1, direction: 'ltr', textFormat: 0, textStyle: '', children: [{ type: 'text', version: 1, text, format: 0, detail: 0, mode: 'normal', style: '' }] })) } }
}
export function productBody(product: Product, original?: Product): Record<string, unknown> {
  const source = product as unknown as Record<string, unknown>
  const before = original as unknown as Record<string, unknown> | undefined
  const body: Record<string, unknown> = {}
  for (const key of editable) {
    if (source[key] !== undefined && (!before || JSON.stringify(source[key]) !== JSON.stringify(before[key]))) body[key] = source[key]
  }
  return relationshipBody(body, product)
}
function relationshipBody(body: Record<string, unknown>, product: Product) {
  if ('categorias' in body) body.categorias = (product.categorias ?? []).map(c => typeof c === 'number' ? c : c.id)
  if ('imagens' in body) body.imagens = (product.imagens ?? []).map(mediaID).filter(Boolean)
  if ('imagemAmbientada' in body) body.imagemAmbientada = mediaID(product.imagemAmbientada) ?? null
  if ('cores' in body) body.cores = (product.cores ?? []).map(color => ({ ...color, imagem: mediaID(color.imagem) ?? null }))
  return body
}

export function copyProduct(product: Product): Product {
  const copy = { ...product, id: undefined, nome: `${product.nome} (cópia)`, codigoSite: '', slug: undefined, updatedAt: undefined, canais: { ...product.canais, site: false } }
  copy.cores = product.cores?.map(({ id: _id, ...color }) => color)
  copy.especificacoes = product.especificacoes?.map(({ id: _id, ...item }) => item)
  return copy
}
export function validateProduct(product: Product): string | undefined {
  if (!product.nome.trim()) return 'Preencha o nome do produto.'
  if (!product.codigoSite.trim()) return 'Preencha o código do produto.'
  const count = product.categorias?.length ?? 0
  if (count < 1 || count > 3) return 'Selecione de uma a três categorias.'
  if ((product.quantidadeMinima ?? 500) < 1) return 'A quantidade mínima deve ser maior que zero.'
}
export function setProductField(product: Product, field: string, value: unknown): Product {
  const [group, child] = field.split('.')
  if (!child) return { ...product, [group]: value }
  const current = (product as unknown as Record<string, unknown>)[group]
  return { ...product, [group]: { ...(typeof current === 'object' && current ? current : {}), [child]: value } }
}
export function fieldValue(product: Product, field: string): string {
  const [group, child] = field.split('.')
  const value = (product as unknown as Record<string, unknown>)[group]
  const selected = child && value && typeof value === 'object' ? (value as Record<string, unknown>)[child] : value
  return typeof selected === 'string' || typeof selected === 'number' ? String(selected) : ''
}
