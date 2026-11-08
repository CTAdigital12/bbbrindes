import { describe, it, expect } from 'vitest'
import { copyImprensa, dateISO, dateInputValue, dateLabelBR, imprensaBody, imprensaSaveIssue, materiaTags, newImprensa, tagIDs, validateImprensa } from '../../src/admin/imprensa/imprensa-data'
import { RequestError } from '../../src/admin/friendly/api-errors'
import type { ImprensaDraft } from '../../src/admin/imprensa/imprensa-model'
const original: ImprensaDraft = {
  id: 3, titulo: 'Industria amplia producao sustentavel', veiculo: 'Valor Econômico',
  data: '2026-04-12T00:00:00.000Z', resumo: 'Resumo da matéria.', url: 'https://valor.test/x',
  tags: [{ id: 1, nome: 'ESG' }], updatedAt: '2026-05-01T00:00:00.000Z',
}
describe('gravacao da materia', () => {
  it('envia apenas o campo alterado', () => {
    expect(imprensaBody({ ...original, resumo: 'Novo resumo.' }, original)).toEqual({ resumo: 'Novo resumo.' })
    expect(imprensaBody(original, original)).toEqual({})
  })
  it('data vira ISO na gravacao', () => {
    expect(imprensaBody({ ...original, data: '2026-05-01' }, original).data).toBe('2026-05-01T00:00:00.000Z')
    expect(imprensaBody({ ...original, data: '' }, original).data).toBe(null)
  })
  it('tags viram ids e preservam a selecao', () => {
    const body = imprensaBody({ ...original, titulo: 'Outro', tags: [{ id: 5, nome: 'A' }, 9] }, original)
    expect(body.tags).toEqual([5, 9])
    expect(tagIDs(original)).toEqual([1])
    expect(materiaTags(original).map(t => t.nome)).toEqual(['ESG'])
  })
})
describe('campo date (helpers)', () => {
  it('converte ISO para o input e de volta', () => {
    expect(dateInputValue('2026-04-12T00:00:00.000Z')).toBe('2026-04-12')
    expect(dateISO('2026-04-12')).toBe('2026-04-12T00:00:00.000Z')
    expect(dateLabelBR('2026-04-12T00:00:00.000Z')).toBe('12/04/2026')
    expect(dateInputValue('')).toBe(''); expect(dateISO('')).toBe(null)
  })
})
describe('duplicacao e novo', () => {
  it('a copia nasce sem id, com sufixo', () => {
    const copy = copyImprensa(original)
    expect(copy.id).toBeUndefined(); expect(copy.titulo).toBe('Industria amplia producao sustentavel (cópia)')
    expect(copy.veiculo).toBe('Valor Econômico')
  })
  it('nova materia comeca vazia', () => {
    const nova = newImprensa()
    expect(nova.titulo).toBe(''); expect(nova.veiculo).toBe(''); expect(nova.data).toBe(''); expect(nova.tags).toEqual([])
  })
})
describe('validacao e erro', () => {
  it('cobra titulo, veiculo e data', () => {
    expect(validateImprensa(original)).toBeUndefined()
    expect(validateImprensa({ ...original, titulo: ' ' })?.field).toBe('bb-imp-titulo')
    expect(validateImprensa({ ...original, veiculo: ' ' })?.field).toBe('bb-imp-veiculo')
    expect(validateImprensa({ ...original, data: '' })?.field).toBe('bb-imp-data')
  })
  it('traduz erro do servidor', () => {
    const issue = imprensaSaveIssue(new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path: 'data', message: 'obrig' }] } }] }))
    expect(issue.field).toBe('bb-imp-data')
  })
})
