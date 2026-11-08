import { describe, it, expect } from 'vitest'
import { logoBody, logoSaveIssue, moverLogo, newLogo, ordenarLogos, validateLogo } from '../../src/admin/logos/logo-data'
import { RequestError } from '../../src/admin/friendly/api-errors'
import type { LogoDraft, LogoRow } from '../../src/admin/logos/logo-model'
const original: LogoDraft = {
  id: 5, nome: 'Braskem', ordem: 2, url: 'https://m.test/braskem.svg', filename: 'braskem.svg', updatedAt: '2026-10-01T00:00:00.000Z',
}
describe('gravacao do logo', () => {
  it('envia apenas o campo alterado', () => {
    expect(logoBody({ ...original, nome: 'Natura' }, original)).toEqual({ nome: 'Natura' })
  })
  it('nada quando igual', () => {
    expect(logoBody(original, original)).toEqual({})
  })
  it('normaliza ordem para numero', () => {
    expect(logoBody({ ...original, ordem: '7' as unknown as number }, original).ordem).toBe(7)
    expect(logoBody({ ...original, ordem: NaN }, original).ordem).toBe(0)
  })
  it('nao inclui url nem filename (o arquivo vai por multipart)', () => {
    const body = logoBody({ ...original, nome: 'X', url: 'https://m.test/outro.svg' }, original)
    expect(body).not.toHaveProperty('url'); expect(body).not.toHaveProperty('filename')
  })
})
describe('novo e validacao', () => {
  it('novo logo nasce vazio com ordem 0', () => {
    const novo = newLogo()
    expect(novo.nome).toBe(''); expect(novo.ordem).toBe(0)
  })
  it('cobra nome e arquivo', () => {
    expect(validateLogo(original, true)).toBeUndefined()
    expect(validateLogo({ ...original, nome: ' ' }, true)?.field).toBe('bb-logo-nome')
    expect(validateLogo({ nome: 'Nova', ordem: 0 }, false)?.field).toBe('bb-logo-file')
  })
  it('traduz erro do servidor', () => {
    const issue = logoSaveIssue(new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path: 'nome', message: 'obrig' }] } }] }))
    expect(issue.field).toBe('bb-logo-nome')
  })
})
describe('reordenacao (moverLogo)', () => {
  const rows: LogoRow[] = [
    { id: 1, nome: 'Alfa', ordem: 0 },
    { id: 2, nome: 'Beta', ordem: 1 },
    { id: 3, nome: 'Gama', ordem: 2 },
  ]
  const ordemDe = (rs: LogoRow[], id: number) => rs.find(r => r.id === id)!.ordem
  it('ordena por ordem crescente', () => {
    expect(ordenarLogos(rows).map(r => r.id)).toEqual([1, 2, 3])
  })
  it('descer troca com o vizinho (2 mudancas)', () => {
    const out = moverLogo(rows, 1, 'down')
    expect(out.changes).toHaveLength(2)
    expect(ordemDe(out.rows, 1)).toBe(1); expect(ordemDe(out.rows, 2)).toBe(0)
    expect(ordenarLogos(out.rows).map(r => r.id)).toEqual([2, 1, 3])
  })
  it('subir o primeiro e no-op', () => {
    expect(moverLogo(rows, 1, 'up').changes).toHaveLength(0)
  })
  it('descer o ultimo e no-op', () => {
    expect(moverLogo(rows, 3, 'down').changes).toHaveLength(0)
  })
})
