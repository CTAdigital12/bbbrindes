import { describe, it, expect } from 'vitest'
import { contatoMascarado, matchStatus, modoLabel, statusKey, statusLabel } from '../../src/admin/orcamentos/orcamento-data'
import type { OrcamentoRow } from '../../src/admin/orcamentos/orcamento-model'
const base: OrcamentoRow = {
  id: 1, requisicaoId: 'req-1', status: 'simulado', modo: 'stub',
  empresa: 'Oi', emailMascarado: 'j***@oi.com', telefoneMascarado: '****-4321',
  qtdItens: 3, totalUnidades: 500, consentimento: true, createdAt: '2026-11-07T12:00:00.000Z',
}
describe('status e modo', () => {
  it('rotula e colore o status', () => {
    expect(statusLabel('entregue')).toBe('Entregue ao CRM')
    expect(statusKey('falhou')).toBe('off')
    expect(statusKey('entregue')).toBe('ok')
    expect(statusKey('simulado')).toBe('warn')
  })
  it('rotula o modo', () => {
    expect(modoLabel('real')).toContain('Real')
    expect(modoLabel('stub')).toContain('Stub')
  })
})
describe('filtro e contato', () => {
  it('filtra por status', () => {
    const match = matchStatus('simulado')
    expect(match(base)).toBe(true)
    expect(match({ ...base, status: 'entregue' })).toBe(false)
    expect(matchStatus('todos')(base)).toBe(true)
  })
  it('junta email e telefone mascarados', () => {
    expect(contatoMascarado(base)).toContain('j***@oi.com')
    expect(contatoMascarado({ emailMascarado: null, telefoneMascarado: null })).toBe('-')
  })
})
