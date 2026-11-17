import { describe, expect, it } from 'vitest'
import { isAdmin, isAdminField, isAdminOrSelf, isEditorOrAdmin, isLoggedIn, roleOf } from '../../src/access/byRole'

// Contrato de seguranca do controle de acesso por papel (byRole). Dois furos:
// 1) collection sem gate de escrita = qualquer autenticado salvava (visualizador
//    inclusive). 2) o legado "role nulo = admin" vazava pra OUTRAS colecoes de
//    auth: um revendedor logado (sem campo role) caia no default admin e
//    escalava privilegio (conteudo + ate criar/apagar usuarios). Os gates agora
//    exigem isPanelUser (colecao `users`), entao o legado so vale pra `users`.
const call = (fn: (args: unknown) => unknown, user: unknown) => fn({ req: { user } } as never)

// Usuarios do painel SEMPRE tem user.collection === 'users' (setado pelo Payload).
const admin = { id: 1, collection: 'users', role: 'admin' }
const editor = { id: 2, collection: 'users', role: 'editor' }
const visualizador = { id: 3, collection: 'users', role: 'visualizador' }
const legado = { id: 4, collection: 'users' } // usuario antigo do painel, sem o campo role
// Revendedor: outra colecao de auth, sem campo role (o furo de escalonamento).
const revendedor = { id: 9, collection: 'revendedores' }

describe('roleOf (nao olha colecao de proposito; por isso os gates checam isPanelUser)', () => {
  it('resolve papel e trata role ausente como admin (legado)', () => {
    expect(roleOf(admin)).toBe('admin')
    expect(roleOf(editor)).toBe('editor')
    expect(roleOf(visualizador)).toBe('visualizador')
    expect(roleOf(legado)).toBe('admin')
    expect(roleOf(null)).toBe('admin')
    // A armadilha: o revendedor tambem cai no default admin aqui. E por isso
    // que os gates abaixo NAO podem confiar so no roleOf.
    expect(roleOf(revendedor)).toBe('admin')
  })
})

describe('isEditorOrAdmin (create/update de conteudo)', () => {
  it('libera admin, editor e admin legado do painel', () => {
    expect(call(isEditorOrAdmin, admin)).toBe(true)
    expect(call(isEditorOrAdmin, editor)).toBe(true)
    expect(call(isEditorOrAdmin, legado)).toBe(true)
  })
  it('bloqueia visualizador, anonimo e principal de outra colecao (revendedor)', () => {
    expect(call(isEditorOrAdmin, visualizador)).toBe(false)
    expect(call(isEditorOrAdmin, null)).toBe(false)
    expect(call(isEditorOrAdmin, revendedor)).toBe(false)
  })
})

describe('isAdmin (delete e areas sensiveis, inclusive create/delete de Users)', () => {
  it('libera so admin do painel (e admin legado)', () => {
    expect(call(isAdmin, admin)).toBe(true)
    expect(call(isAdmin, legado)).toBe(true)
  })
  it('bloqueia editor, visualizador, anonimo e revendedor (escalonamento fechado)', () => {
    expect(call(isAdmin, editor)).toBe(false)
    expect(call(isAdmin, visualizador)).toBe(false)
    expect(call(isAdmin, null)).toBe(false)
    expect(call(isAdmin, revendedor)).toBe(false)
  })
})

describe('isAdminOrSelf (read/update de Users)', () => {
  it('admin do painel ve tudo; outro usuario do painel so o proprio registro', () => {
    expect(call(isAdminOrSelf, admin)).toBe(true)
    expect(call(isAdminOrSelf, legado)).toBe(true)
    expect(call(isAdminOrSelf, editor)).toEqual({ id: { equals: editor.id } })
    expect(call(isAdminOrSelf, visualizador)).toEqual({ id: { equals: visualizador.id } })
  })
  it('nega anonimo e revendedor (revendedor nao le/edita Users)', () => {
    expect(call(isAdminOrSelf, null)).toBe(false)
    expect(call(isAdminOrSelf, revendedor)).toBe(false)
  })
})

describe('isAdminField (ex.: campo role de Users)', () => {
  it('so admin do painel; bloqueia editor, visualizador e revendedor', () => {
    expect(call(isAdminField, admin)).toBe(true)
    expect(call(isAdminField, legado)).toBe(true)
    expect(call(isAdminField, editor)).toBe(false)
    expect(call(isAdminField, visualizador)).toBe(false)
    expect(call(isAdminField, revendedor)).toBe(false)
  })
})

describe('isLoggedIn (so exige autenticacao, qualquer colecao)', () => {
  it('aceita qualquer autenticado e nega anonimo', () => {
    expect(call(isLoggedIn, visualizador)).toBe(true)
    expect(call(isLoggedIn, revendedor)).toBe(true)
    expect(call(isLoggedIn, null)).toBe(false)
  })
})
