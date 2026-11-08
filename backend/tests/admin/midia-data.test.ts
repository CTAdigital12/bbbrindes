import { describe, it, expect } from 'vitest'
import { altBody, altSaveIssue, fileSizeLabel, semDescricao, validateAlt } from '../../src/admin/midia/midia-data'
import { RequestError } from '../../src/admin/friendly/api-errors'
describe('descricao (alt) da midia', () => {
  it('so manda alt quando muda, aparando espacos', () => {
    expect(altBody('Squeeze verde', 'Squeeze verde')).toEqual({})
    expect(altBody('  Squeeze verde  ', 'Squeeze verde')).toEqual({})
    expect(altBody('Novo texto', 'Squeeze verde')).toEqual({ alt: 'Novo texto' })
  })
  it('sem original, sempre manda (criacao de descricao)', () => {
    expect(altBody('Primeiro alt')).toEqual({ alt: 'Primeiro alt' })
  })
  it('cobra a descricao', () => {
    expect(validateAlt('Logo da marca')).toBeUndefined()
    expect(validateAlt('   ')?.field).toBe('bb-midia-alt')
  })
  it('traduz erro do servidor no campo alt', () => {
    const issue = altSaveIssue(new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path: 'alt', message: 'obrig' }] } }] }))
    expect(issue.field).toBe('bb-midia-alt')
  })
})
describe('rotulos auxiliares', () => {
  it('formata o tamanho do arquivo', () => {
    expect(fileSizeLabel({ filename: 'a', filesize: 0 })).toBe('')
    expect(fileSizeLabel({ filename: 'a', filesize: 512 })).toBe('512 B')
    expect(fileSizeLabel({ filename: 'a', filesize: 2048 })).toBe('2 KB')
    expect(fileSizeLabel({ filename: 'a', filesize: 3 * 1024 * 1024 })).toBe('3.0 MB')
  })
  it('detecta imagem sem descricao', () => {
    expect(semDescricao({ alt: '' })).toBe(true)
    expect(semDescricao({ alt: '  ' })).toBe(true)
    expect(semDescricao({ alt: 'ok' })).toBe(false)
  })
})
