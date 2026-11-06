import { describe, expect, it } from 'vitest'
import { RequestError } from '../../src/admin/friendly/api-errors'
import { getProductIssue, productSaveIssue } from '../../src/admin/friendly/product-validation'
const product = { nome: 'Caneca', codigoSite: '137GC', categorias: [1], quantidadeMinima: 500 }
describe('orientacao das validacoes de produto', () => {
 it('identifica a primeira cor sem nome e aponta para o campo certo', () => {
  const issue = getProductIssue({ ...product, cores: [{ nome: 'Azul' }, { nome: '   ' }] })
  expect(issue).toEqual({ message: 'Preencha o nome da cor 2 na aba Cores, ou remova essa cor se não for utilizá-la.', tab: 'cores', field: 'bb-cor-nome-1' })
 })
 it('nao exige cadastrar cores nem altera o codigo alfanumerico', () => {
  expect(getProductIssue(product)).toBeUndefined()
  expect(getProductIssue({ ...product, codigoSite: '233 CL', cores: [{ nome: 'Azul' }] })).toBeUndefined()
 })
 it('traduz a resposta real do Payload para o nome de cor e abre Cores', () => {
  const error = new RequestError(400, { errors: [{ name: 'ValidationError', message: 'The following field is invalid: Cores 1 > Nome', data: { collection: 'produtos', errors: [{ label: 'Cores 1 > Nome', path: 'cores.0.nome', message: 'This field is required.' }] } }] })
  expect(productSaveIssue(error)).toEqual({ message: 'Preencha o nome da cor 1 na aba Cores, ou remova essa cor se não for utilizá-la.', tab: 'cores', field: 'bb-cor-nome-0' })
 })
 it('explica codigo duplicado sem sugerir preencher um campo que ja tem valor', () => {
  const error = new RequestError(400, { errors: [{ message: 'The following field is invalid: Codigo site', data: { errors: [{ path: 'codigoSite', message: 'Value must be unique' }] } }] })
  expect(productSaveIssue(error)).toEqual({ message: 'Já existe um produto com esse código. Informe outro código.', tab: 'geral', field: 'bb-codigoSite' })
 })
 it('nao mostra o resumo tecnico em ingles quando nao ha caminho utilizavel', () => {
  const error = new RequestError(400, { errors: [{ message: 'The following field is invalid: Campo desconhecido' }] })
  expect(productSaveIssue(error).message).toBe('Não foi possível salvar. Confira os campos preenchidos e tente novamente.')
 })
 it('preserva mensagens claras e diferencia falhas de conexao', () => {
  expect(productSaveIssue(new Error('Arquivo inválido.')).message).toBe('Arquivo inválido.')
  expect(productSaveIssue(new TypeError('Failed to fetch')).message).toContain('conexão')
 })
})
