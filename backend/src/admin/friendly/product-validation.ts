import type { Product } from './model'
import { RequestError } from './api-errors'
export type ProductIssue = { message: string; tab?: string; field?: string }
const required = {
  nome: { message: 'Preencha o nome do produto.', tab: 'geral', field: 'bb-nome' },
  codigoSite: { message: 'Preencha o código do produto.', tab: 'geral', field: 'bb-codigoSite' },
  categorias: { message: 'Selecione de uma a três categorias.' },
  quantidadeMinima: { message: 'A quantidade mínima deve ser maior que zero.', tab: 'geral', field: 'bb-quantidadeMinima' },
} satisfies Record<string, ProductIssue>
function basicIssue(product: Product): ProductIssue | undefined {
  if (!product.nome.trim()) return required.nome
  if (!product.codigoSite.trim()) return required.codigoSite
  const count = product.categorias?.length ?? 0
  if (count < 1 || count > 3) return required.categorias
  if ((product.quantidadeMinima ?? 500) < 1) return required.quantidadeMinima
}
function colorIssue(index: number): ProductIssue {
  return { message: `Preencha o nome da cor ${index + 1} na aba Cores, ou remova essa cor se não for utilizá-la.`, tab: 'cores', field: `bb-cor-nome-${index}` }
}
export function getProductIssue(product: Product): ProductIssue | undefined {
  const basic = basicIssue(product)
  if (basic) return basic
  const missing = (product.cores ?? []).findIndex(color => !(color.nome ?? '').trim())
  return missing >= 0 ? colorIssue(missing) : undefined
}
function serverFieldIssue(path: string, message: string): ProductIssue | undefined {
  const color = /^cores\.(\d+)\.nome$/.exec(path)
  if (color) return colorIssue(Number(color[1]))
  if (path === 'codigoSite' && /unique|duplicad|já existe/i.test(message)) return { ...required.codigoSite, message: 'Já existe um produto com esse código. Informe outro código.' }
  return Object.hasOwn(required, path) ? required[path as keyof typeof required] : undefined
}
export function productSaveIssue(cause: unknown): ProductIssue {
  if (cause instanceof RequestError) {
    for (const field of cause.fields) {
      const issue = serverFieldIssue(field.path, field.message)
      if (issue) return issue
    }
    if (cause.fields.length || /following fields? (?:is|are) invalid/i.test(cause.message)) return { message: 'Não foi possível salvar. Confira os campos preenchidos e tente novamente.' }
  }
  if (cause instanceof TypeError) return { message: 'Não foi possível conectar ao painel. Verifique sua conexão e tente novamente.' }
  return { message: cause instanceof Error ? cause.message : 'Não foi possível salvar. Tente novamente.' }
}
