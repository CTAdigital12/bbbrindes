"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Icon } from '../friendly/icons'
import { grupoRank } from './categoria-model'
import { CATEGORIA_PATH, type CategoriaRow } from './categoria-model'
import { CategoriaListRow } from './CategoriaListRow'
const FILTERS = [
  ['todos', 'Todas', () => true],
  ['ecologicos', 'Ecológicos', (c: CategoriaRow) => c.grupo === 'ecologicos'],
  ['geral', 'Geral', (c: CategoriaRow) => c.grupo !== 'ecologicos'],
] as const
// Ecologicos no topo (como no site), depois Geral; dentro do grupo, ordem e nome.
function ordenar(rows: CategoriaRow[]): CategoriaRow[] {
  return [...rows].sort((a, b) =>
    grupoRank(a.grupo) - grupoRank(b.grupo) ||
    (a.ordem ?? 0) - (b.ordem ?? 0) ||
    a.nome.localeCompare(b.nome, 'pt-BR'))
}
export function CategoriaList({ initial, canCreate = true }: { initial: CategoriaRow[]; canCreate?: boolean }) {
  const [filter, setFilter] = useState('todos')
  const [search, setSearch] = useState('')
  const visible = useMemo(() => ordenar(initial
    .filter(FILTERS.find(f => f[0] === filter)![2])
    .filter(c => c.nome.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')))), [initial, filter, search])
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Categorias</h1>{canCreate ? <Link className="btn" href={`${CATEGORIA_PATH}/create`}><Icon name="plus" />Adicionar categoria</Link> : null}</div>
    <p className="sub">Categorias do catálogo: a grade da home e o menu de produtos. Os Ecológicos ficam agrupados no topo; a ordem define a sequência.</p>
    <div className="subsub">{FILTERS.map(([key, label, match], index) => <React.Fragment key={key}>{index ? <span className="sep">|</span> : null}<button type="button" className={filter === key ? 'on' : ''} onClick={() => setFilter(key)}>{label} <span className="n">({initial.filter(match).length})</span></button></React.Fragment>)}</div>
    <div className="toolbar"><span className="sp" /><input className="inp search" type="search" aria-label="Buscar categorias" placeholder="Buscar categorias…" value={search} onChange={event => setSearch(event.target.value)} /></div>
    <div className="bb-table-scroll"><table className="list"><thead><tr><th>Ícone</th><th>Categoria</th><th>Grupo</th><th>Ordem</th><th>Produtos</th></tr></thead><tbody>{visible.map(c => <CategoriaListRow key={c.id} categoria={c} canCreate={canCreate} />)}{!visible.length ? <tr><td colSpan={5} className="empty">Nenhuma categoria neste filtro.</td></tr> : null}</tbody></table></div>
  </section></div>
}
