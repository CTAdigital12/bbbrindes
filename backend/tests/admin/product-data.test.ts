import { describe, it, expect } from 'vitest'
import { copyProduct, plainText, productBody, richText, setProductField, validateProduct } from '../../src/admin/friendly/product-data'
import type { Product } from '../../src/admin/friendly/model'
const original: Product = { id: 1, nome: 'Caneca', codigoSite: '123', slug: 'caneca', quantidadeMinima: 500,
  categorias: [{ id: 2, nome: 'Canecas' }], imagens: [{ id: 3, url: 'https://midia.test/3.webp' }],
  canais: { site: true, tabelaRevenda: true }, seo: { titleTag: 'Titulo', metaDescription: 'Preservar' },
  descricaoCompleta: richText('Descricao original'), cores: [{ id: 'row-1', nome: 'Azul', imagem: { id: 4 } }],
  especificacoes: [{ id: 'spec-1', rotulo: 'Material', valor: 'PP' }], crm: { preco: 10 },
}
describe('salvamento sem perda de dados', () => {
 it('envia apenas o campo alterado, preservando descricao rica e relacoes', () => {
   expect(productBody({ ...original, nome: 'Novo nome' }, original)).toEqual({ nome: 'Novo nome' })
 })
 it('preserva os demais valores do grupo ao editar um subcampo', () => {
   const edited = setProductField(original, 'seo.titleTag', 'Novo titulo')
   expect(productBody(edited, original)).toEqual({ seo: { titleTag: 'Novo titulo', metaDescription: 'Preservar' } })
   expect(original.seo?.titleTag).toBe('Titulo')
 })
 it('publicacao preserva as configuracoes de outros canais', () => {
   expect(productBody({ ...original, canais: { ...original.canais, site: false } }, original)).toEqual({ canais: { site: false, tabelaRevenda: true } })
 })
 it('normaliza referencias e mantem a ordem da galeria', () => {
   const body = productBody({ ...original, imagens: [{ id: 8 }, { id: 3 }], cores: [{ id: 'row-1', nome: 'Azul', imagem: null }] }, original)
   expect(body.imagens).toEqual([8, 3]); expect(body.cores).toEqual([{ id: 'row-1', nome: 'Azul', imagem: null }])
 })
 it('nao envia identidade, slug, timestamps nem dados do CRM na criacao', () => {
   const body = productBody(original)
   expect(body).not.toHaveProperty('id'); expect(body).not.toHaveProperty('slug'); expect(body).not.toHaveProperty('crm')
   expect(body.categorias).toEqual([2])
 })
 it('duplicacao exige novo codigo e nao reutiliza IDs de arrays', () => {
   const copy = copyProduct(original)
   expect(copy.codigoSite).toBe(''); expect(copy.id).toBeUndefined(); expect(copy.slug).toBeUndefined()
   expect(copy.cores?.[0].id).toBeUndefined(); expect(copy.especificacoes?.[0].id).toBeUndefined()
   expect(copy.canais?.site).toBe(false)
 })
 it('valida os campos obrigatorios e o limite de categorias', () => {
   expect(validateProduct(original)).toBeUndefined()
   expect(validateProduct({ ...original, nome: '' })).toMatch(/nome/)
   expect(validateProduct({ ...original, codigoSite: '' })).toMatch(/código/)
   expect(validateProduct({ ...original, categorias: [1,2,3,4] })).toMatch(/categorias/)
   expect(validateProduct({ ...original, quantidadeMinima: 0 })).toMatch(/mínima/)
 })
 it('converte paragrafos para edicao sem concatenar palavras', () => {
   expect(plainText(richText('Primeiro paragrafo.\n\nSegundo.'))).toBe('Primeiro paragrafo.\n\nSegundo.')
 })
})
