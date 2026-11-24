import { describe, expect, it } from 'vitest'

import { decodeRefCrm, montarRefCrm } from './ref-crm'

describe('montarRefCrm', () => {
  it('monta base + acessorio reais (CIGAM 7 chars)', () => {
    expect(montarRefCrm('MV01109', '02', '07')).toBe('MV011090207')
  })

  it('cor unica: acessorio ausente vira 00', () => {
    expect(montarRefCrm('MV01444', '02', null)).toBe('MV014440200')
  })

  it('cor especial 99 no acessorio', () => {
    expect(montarRefCrm('MV01109', '02', '99')).toBe('MV011090299')
  })

  it('base 00 = incompleto -> null', () => {
    expect(montarRefCrm('MV01109', '00', '07')).toBeNull()
  })

  it('base vazia (normaliza para 00) -> null', () => {
    expect(montarRefCrm('MV01109', '', '07')).toBeNull()
  })

  it('cigam vazio -> null', () => {
    expect(montarRefCrm('', '02', '07')).toBeNull()
  })

  it('CIGAM de tamanho variavel (Green Fibras, 9 chars)', () => {
    expect(montarRefCrm('MV02109GC', '02', '52')).toBe('MV02109GC0252')
  })
})

describe('decodeRefCrm', () => {
  it('decodifica CIGAM 7 chars', () => {
    expect(decodeRefCrm('MV011090207')).toEqual({
      cigam: 'MV01109',
      base: '02',
      acessorio: '07',
    })
  })

  it('decodifica CIGAM variavel (round-trip com montarRefCrm)', () => {
    const cod = montarRefCrm('MV02109GC', '02', '52')
    expect(cod).toBe('MV02109GC0252')
    expect(decodeRefCrm(cod as string)).toEqual({
      cigam: 'MV02109GC',
      base: '02',
      acessorio: '52',
    })
  })

  it('cod curto demais -> null', () => {
    expect(decodeRefCrm('MV01')).toBeNull()
  })

  it('shape invalido (4 finais nao sao digitos) -> null', () => {
    expect(decodeRefCrm('MV0110902AB')).toBeNull()
  })
})
