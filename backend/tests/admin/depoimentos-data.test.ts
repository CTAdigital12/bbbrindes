import { describe, it, expect } from 'vitest'
import { activeDepoimento, copyDepoimento, depoimentoBody, depSaveIssue, depStatus, moverDepoimento, newDepoimento, ordenarDepoimentos, validateDepoimento } from '../../src/admin/depoimentos/depoimento-data'
import { depoimentoFonte } from '../../src/admin/depoimentos/depoimento-model'
import { RequestError } from '../../src/admin/friendly/api-errors'
import type { DepoimentoDraft, DepoimentoRow } from '../../src/admin/depoimentos/depoimento-model'
const original: DepoimentoDraft = {
  id: 3, texto: 'Entrega no prazo e qualidade.', autor: 'Lilian Bueno', empresa: 'Braskem',
  foto: { id: 40, url: 'https://m.test/40.webp' }, ordem: 2, ativo: true, updatedAt: '2026-10-01T00:00:00.000Z',
}
describe('gravacao do depoimento', () => {
  it('envia apenas o campo alterado', () => {
    expect(depoimentoBody({ ...original, empresa: 'Natura' }, original)).toEqual({ empresa: 'Natura' })
  })
  it('nada quando igual', () => {
    expect(depoimentoBody(original, original)).toEqual({})
  })
  it('normaliza foto para id e ordem para numero', () => {
    const body = depoimentoBody({ ...original, foto: { id: 55 }, ordem: '7' as unknown as number }, original)
    expect(body.foto).toBe(55); expect(body.ordem).toBe(7)
    expect(depoimentoBody({ ...original, foto: null }, original).foto).toBe(null)
  })
  it('ordem invalida vira 0', () => {
    expect(depoimentoBody({ ...original, ordem: NaN }, original).ordem).toBe(0)
  })
  it('monta a fonte "Autor, Empresa"', () => {
    expect(depoimentoFonte(original)).toBe('Lilian Bueno, Braskem')
    expect(depoimentoFonte({ ...original, empresa: '' })).toBe('Lilian Bueno')
  })
})
describe('duplicacao, novo e status', () => {
  it('a copia nasce inativa e sem id, com sufixo no autor', () => {
    const copy = copyDepoimento(original)
    expect(copy.id).toBeUndefined(); expect(copy.ativo).toBe(false); expect(copy.autor).toBe('Lilian Bueno (cópia)')
  })
  it('novo depoimento nasce ativo e vazio', () => {
    const novo = newDepoimento()
    expect(novo.ativo).toBe(true); expect(novo.ordem).toBe(0); expect(novo.texto).toBe('')
  })
  it('descreve o status', () => {
    expect(depStatus(original)[0]).toBe('ok')
    expect(depStatus({ ...original, ativo: false })[0]).toBe('off')
    expect(activeDepoimento({ ...original, ativo: false })).toBe(false)
  })
})
describe('validacao e erro', () => {
  it('cobra texto e autor', () => {
    expect(validateDepoimento(original)).toBeUndefined()
    expect(validateDepoimento({ ...original, texto: ' ' })?.field).toBe('bb-dep-texto')
    expect(validateDepoimento({ ...original, autor: ' ' })?.field).toBe('bb-dep-autor')
  })
  it('traduz erro do servidor', () => {
    const issue = depSaveIssue(new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path: 'autor', message: 'obrig' }] } }] }))
    expect(issue.field).toBe('bb-dep-autor')
  })
})
describe('reordenacao (moverDepoimento)', () => {
  const rows: DepoimentoRow[] = [
    { id: 1, texto: 'a', autor: 'Ana', ordem: 0 },
    { id: 2, texto: 'b', autor: 'Bruno', ordem: 1 },
    { id: 3, texto: 'c', autor: 'Carla', ordem: 2 },
    { id: 4, texto: 'd', autor: 'Davi', ordem: 3 },
  ]
  const ordemDe = (rs: DepoimentoRow[], id: number) => rs.find(r => r.id === id)!.ordem
  it('ordena por ordem crescente', () => {
    expect(ordenarDepoimentos(rows).map(r => r.id)).toEqual([1, 2, 3, 4])
  })
  it('descer troca com o vizinho (2 mudancas)', () => {
    const out = moverDepoimento(rows, 2, 'down')
    expect(out.changes).toHaveLength(2)
    expect(ordemDe(out.rows, 2)).toBe(2); expect(ordemDe(out.rows, 3)).toBe(1)
    expect(ordenarDepoimentos(out.rows).map(r => r.id)).toEqual([1, 3, 2, 4])
  })
  it('subir o primeiro e no-op', () => {
    expect(moverDepoimento(rows, 1, 'up').changes).toHaveLength(0)
  })
  it('descer o ultimo e no-op', () => {
    expect(moverDepoimento(rows, 4, 'down').changes).toHaveLength(0)
  })
})
