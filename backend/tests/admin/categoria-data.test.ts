import { describe, it, expect } from 'vitest'
import { categoriaBody, catSaveIssue, copyCategoria, moverCategoria, newCategoria, ordenarCategorias, validateCategoria } from '../../src/admin/categorias/categoria-data'
import { grupoLabel, grupoRank } from '../../src/admin/categorias/categoria-model'
import { RequestError } from '../../src/admin/friendly/api-errors'
import type { CategoriaDraft, CategoriaRow } from '../../src/admin/categorias/categoria-model'
const original: CategoriaDraft = {
  id: 4, nome: 'Copos', slug: 'copos', grupo: 'geral', ordem: 3,
  icone: { id: 70, url: 'https://m.test/70.webp' }, updatedAt: '2026-10-01T00:00:00.000Z',
}
describe('gravacao da categoria', () => {
  it('envia apenas o campo alterado', () => {
    expect(categoriaBody({ ...original, ordem: 5 }, original)).toEqual({ ordem: 5 })
  })
  it('nao envia slug (protegido) nem nada quando igual', () => {
    expect(categoriaBody(original, original)).toEqual({})
    expect(categoriaBody({ ...original, nome: 'Copos e Taças' }, original)).not.toHaveProperty('slug')
  })
  it('normaliza icone para id e ordem para numero', () => {
    const body = categoriaBody({ ...original, icone: { id: 90 }, ordem: '7' as unknown as number }, original)
    expect(body.icone).toBe(90); expect(body.ordem).toBe(7)
    expect(categoriaBody({ ...original, icone: null }, original).icone).toBe(null)
  })
  it('ordem invalida vira 0', () => {
    expect(categoriaBody({ ...original, ordem: NaN }, original).ordem).toBe(0)
  })
})
describe('duplicacao e novo', () => {
  it('a copia nasce sem id e sem slug, com sufixo', () => {
    const copy = copyCategoria(original)
    expect(copy.id).toBeUndefined(); expect(copy.slug).toBeUndefined()
    expect(copy.nome).toBe('Copos (cópia)'); expect(copy.grupo).toBe('geral')
  })
  it('nova categoria comeca no grupo geral e ordem 0', () => {
    const nova = newCategoria()
    expect(nova.grupo).toBe('geral'); expect(nova.ordem).toBe(0); expect(nova.nome).toBe('')
  })
})
describe('validacao, grupo e erro', () => {
  it('cobra o nome', () => {
    expect(validateCategoria(original)).toBeUndefined()
    expect(validateCategoria({ ...original, nome: ' ' })?.field).toBe('bb-cat-nome')
  })
  it('rotula e ordena os grupos (ecologicos no topo)', () => {
    expect(grupoLabel('ecologicos')).toBe('Ecológicos')
    expect(grupoLabel(undefined)).toBe('Geral')
    expect(grupoRank('ecologicos')).toBeLessThan(grupoRank('geral'))
  })
  it('traduz erro do servidor', () => {
    const issue = catSaveIssue(new RequestError(400, { errors: [{ message: 'x', data: { errors: [{ path: 'nome', message: 'obrig' }] } }] }))
    expect(issue.field).toBe('bb-cat-nome')
  })
})
describe('reordenacao (moverCategoria)', () => {
  const rows: CategoriaRow[] = [
    { id: 1, nome: 'Green Plasticaria', grupo: 'ecologicos', ordem: 0 },
    { id: 2, nome: 'Green Fibras', grupo: 'ecologicos', ordem: 1 },
    { id: 3, nome: 'Medalhas', grupo: 'ecologicos', ordem: 2 },
    { id: 4, nome: 'Copos', grupo: 'geral', ordem: 3 },
    { id: 5, nome: 'Canecas', grupo: 'geral', ordem: 4 },
    { id: 6, nome: 'Chaveiros', grupo: 'geral', ordem: 5 },
  ]
  const ordemDe = (rs: CategoriaRow[], id: number) => rs.find(r => r.id === id)!.ordem
  it('ordena ecologicos primeiro, depois geral', () => {
    expect(ordenarCategorias(rows).map(r => r.id)).toEqual([1, 2, 3, 4, 5, 6])
  })
  it('descer troca com o vizinho do mesmo grupo (2 mudancas)', () => {
    const out = moverCategoria(rows, 2, 'down')
    expect(out.changes).toHaveLength(2)
    expect(ordemDe(out.rows, 2)).toBe(2); expect(ordemDe(out.rows, 3)).toBe(1)
    expect(ordenarCategorias(out.rows).map(r => r.id)).toEqual([1, 3, 2, 4, 5, 6])
  })
  it('subir o primeiro do grupo e no-op', () => {
    expect(moverCategoria(rows, 1, 'up').changes).toHaveLength(0)
  })
  it('descer o ultimo e no-op', () => {
    expect(moverCategoria(rows, 6, 'down').changes).toHaveLength(0)
  })
  it('nao cruza a fronteira de grupo (primeiro geral nao sobe para ecologicos)', () => {
    expect(moverCategoria(rows, 4, 'up').changes).toHaveLength(0)
  })
  it('renumera mantendo ecologicos com a ordem menor', () => {
    const out = moverCategoria(rows, 4, 'down')
    expect(ordemDe(out.rows, 4)).toBe(4); expect(ordemDe(out.rows, 5)).toBe(3)
    expect(ordenarCategorias(out.rows).map(r => r.id)).toEqual([1, 2, 3, 5, 4, 6])
  })
})
