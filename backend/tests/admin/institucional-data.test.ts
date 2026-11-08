import { describe, it, expect } from 'vitest'
import { institucionalBody, institucionalSaveIssue, validateInstitucional } from '../../src/admin/institucional/institucional-data'
import { RequestError } from '../../src/admin/friendly/api-errors'
import type { InstitucionalContent } from '../../src/admin/institucional/institucional-model'
const base: InstitucionalContent = {
  quemSomos: {
    eyebrow: 'Quem somos', titulo: 'Somos fábrica', paragrafo1: 'P1', paragrafo2: 'P2',
    numeros: [{ id: 'n1', valor: '27 anos', rotulo: 'de mercado' }],
    sustentabilidade: [{ id: 's1', icone: 'controle-de-qualidade', titulo: 'Controle' }],
    selos: [{ id: 'c1', sigla: 'SMETA', desc: 'Auditoria' }],
    fotoFabrica: { id: 70, url: 'https://m.test/70.webp' },
    galeria: [{ id: 'g1', imagem: 71, legenda: 'Máquina' }],
  },
  sac: { titulo: 'SAC', texto: 'Conta o que aconteceu.', motivos: [{ id: 'm1', texto: 'Status do pedido' }] },
  linhaDoTempo: [{ id: 't1', ano: '2000', titulo: 'Começo', texto: 'Curitiba', destaqueResumo: false }],
}
describe('gravacao do conteudo institucional', () => {
  it('manda os tres blocos (nenhum bloco some)', () => {
    const body = institucionalBody(base)
    for (const key of ['quemSomos', 'sac', 'linhaDoTempo']) expect(body).toHaveProperty(key)
  })
  it('troca as imagens pelo id da Media (objeto, numero ou null)', () => {
    const body = institucionalBody(base) as { quemSomos: { fotoFabrica: unknown; galeria: { imagem: unknown }[] } }
    expect(body.quemSomos.fotoFabrica).toBe(70)
    expect(body.quemSomos.galeria[0].imagem).toBe(71)
    const semFoto = institucionalBody({ ...base, quemSomos: { ...base.quemSomos, fotoFabrica: null } }) as { quemSomos: { fotoFabrica: unknown } }
    expect(semFoto.quemSomos.fotoFabrica).toBe(null)
  })
  it('preserva os ids das linhas dos arrays', () => {
    const body = institucionalBody(base) as { quemSomos: { numeros: { id?: string }[]; selos: { id?: string }[] }; linhaDoTempo: { id?: string }[] }
    expect(body.quemSomos.numeros[0].id).toBe('n1')
    expect(body.quemSomos.selos[0].id).toBe('c1')
    expect(body.linhaDoTempo[0].id).toBe('t1')
  })
  it('normaliza destaqueResumo para booleano', () => {
    const body = institucionalBody(base) as { linhaDoTempo: { destaqueResumo: unknown }[] }
    expect(body.linhaDoTempo[0].destaqueResumo).toBe(false)
  })
})
describe('validacao do conteudo institucional', () => {
  it('aceita um conteudo completo', () => { expect(validateInstitucional(base)).toBeUndefined() })
  it('cobra valor/rotulo dos numeros', () => {
    expect(validateInstitucional({ ...base, quemSomos: { ...base.quemSomos, numeros: [{ valor: '', rotulo: 'x' }] } })?.message).toMatch(/numeros/)
  })
  it('cobra icone/titulo da sustentabilidade', () => {
    expect(validateInstitucional({ ...base, quemSomos: { ...base.quemSomos, sustentabilidade: [{ icone: 'x', titulo: '' }] } })?.message).toMatch(/Sustentabilidade/)
  })
  it('cobra sigla/desc das certificacoes', () => {
    expect(validateInstitucional({ ...base, quemSomos: { ...base.quemSomos, selos: [{ sigla: '', desc: 'x' }] } })?.message).toMatch(/Certificacoes/)
  })
  it('cobra a imagem de cada foto da galeria', () => {
    expect(validateInstitucional({ ...base, quemSomos: { ...base.quemSomos, galeria: [{ legenda: 'sem foto' }] } })?.message).toMatch(/Galeria/)
  })
  it('cobra o texto dos motivos do SAC', () => {
    expect(validateInstitucional({ ...base, sac: { ...base.sac, motivos: [{ texto: ' ' }] } })?.message).toMatch(/SAC/)
  })
  it('cobra ano/titulo/texto dos marcos da linha do tempo', () => {
    expect(validateInstitucional({ ...base, linhaDoTempo: [{ ano: '', titulo: 'x', texto: 'y' }] })?.message).toMatch(/Linha do tempo/)
  })
})
describe('erro de servidor', () => {
  it('vira mensagem amigavel', () => {
    const issue = institucionalSaveIssue(new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path: 'quemSomos', message: 'y' }] } }] }))
    expect(issue.message).toMatch(/Confira/)
  })
})
