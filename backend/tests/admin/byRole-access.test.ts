import { describe, expect, it } from 'vitest'
import { isAdmin, isEditorOrAdmin, isLoggedIn, roleOf } from '../../src/access/byRole'

// Contrato de seguranca do controle de acesso por papel (byRole). O furo era:
// collection sem gate de escrita = qualquer usuario autenticado (inclusive o
// visualizador) salvava. Estes testes travam a regra: visualizador nao escreve,
// anonimo nao escreve, e o admin legado (role nulo) continua com acesso total.
const call = (fn: (args: unknown) => unknown, user: unknown) => fn({ req: { user } } as never)

const admin = { id: 1, role: 'admin' }
const editor = { id: 2, role: 'editor' }
const visualizador = { id: 3, role: 'visualizador' }
const legado = { id: 4 } // usuario antigo, sem o campo role

describe('roleOf', () => {
  it('resolve o papel e trata role ausente (legado) como admin de proposito', () => {
    expect(roleOf(admin)).toBe('admin')
    expect(roleOf(editor)).toBe('editor')
    expect(roleOf(visualizador)).toBe('visualizador')
    expect(roleOf(legado)).toBe('admin')
    expect(roleOf(null)).toBe('admin')
    expect(roleOf({ id: 5, role: 'qualquer' })).toBe('admin')
  })
})

describe('isEditorOrAdmin (create/update de conteudo)', () => {
  it('libera admin, editor e admin legado; bloqueia visualizador e anonimo', () => {
    expect(call(isEditorOrAdmin, admin)).toBe(true)
    expect(call(isEditorOrAdmin, editor)).toBe(true)
    expect(call(isEditorOrAdmin, legado)).toBe(true)
    expect(call(isEditorOrAdmin, visualizador)).toBe(false)
    expect(call(isEditorOrAdmin, null)).toBe(false)
  })
})

describe('isAdmin (delete e areas sensiveis)', () => {
  it('libera so admin (e admin legado); bloqueia editor, visualizador e anonimo', () => {
    expect(call(isAdmin, admin)).toBe(true)
    expect(call(isAdmin, legado)).toBe(true)
    expect(call(isAdmin, editor)).toBe(false)
    expect(call(isAdmin, visualizador)).toBe(false)
    expect(call(isAdmin, null)).toBe(false)
  })
})

describe('isLoggedIn', () => {
  it('exige usuario autenticado', () => {
    expect(call(isLoggedIn, visualizador)).toBe(true)
    expect(call(isLoggedIn, null)).toBe(false)
  })
})
