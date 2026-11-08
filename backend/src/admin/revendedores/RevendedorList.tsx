"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Icon } from '../friendly/icons'
import { isActive } from './revendedores-data'
import { REVENDEDOR_PATH, type RevendedorRow } from './revendedores-model'
import { RevendedorListRow } from './RevendedorListRow'

const FILTERS = [
  ['todos', 'Todos', (_r: RevendedorRow) => true],
  ['ativos', 'Ativos', (r: RevendedorRow) => isActive(r)],
  ['analise', 'Em análise', (r: RevendedorRow) => !isActive(r)],
] as const

// Busca por empresa (razao social), nome fantasia e CNPJ.
const matchSearch = (r: RevendedorRow, q: string): boolean =>
  `${r.empresa ?? ''} ${r.nomeFantasia ?? ''} ${r.cnpj ?? ''}`.toLocaleLowerCase('pt-BR').includes(q)

export function RevendedorList({ initial, canCreate = true, canUpdate = true }: { initial: RevendedorRow[]; canCreate?: boolean; canUpdate?: boolean }) {
  const [filter, setFilter] = useState('todos')
  const [search, setSearch] = useState('')
  const visible = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('pt-BR')
    return initial.filter(FILTERS.find(f => f[0] === filter)![2]).filter(r => !q || matchSearch(r, q))
  }, [initial, filter, search])
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Revendedores</h1>{canCreate ? <Link className="btn" href={`${REVENDEDOR_PATH}/create`}><Icon name="plus" />Adicionar revendedor</Link> : null}</div>
    <p className="sub">Contas do portal de revenda. Aprovar um revendedor (Ativo) libera o login e exige a tabela de preço (nível) no mesmo passo.</p>
    <div className="subsub">{FILTERS.map(([key, label, match], index) => <React.Fragment key={key}>{index ? <span className="sep">|</span> : null}<button type="button" className={filter === key ? 'on' : ''} onClick={() => setFilter(key)}>{label} <span className="n">({initial.filter(match).length})</span></button></React.Fragment>)}</div>
    <div className="toolbar"><span className="sp" /><input className="inp search" type="search" aria-label="Buscar por empresa ou CNPJ" placeholder="Buscar por empresa ou CNPJ…" value={search} onChange={event => setSearch(event.target.value)} /></div>
    <div className="bb-table-scroll"><table className="list"><thead><tr><th>Empresa</th><th>CNPJ</th><th>Responsável</th><th>Nível (tabela)</th><th>Status</th></tr></thead><tbody>{visible.map(r => <RevendedorListRow key={r.id} revendedor={r} canUpdate={canUpdate} />)}{!visible.length ? <tr><td colSpan={5} className="empty">Nenhum revendedor neste filtro.</td></tr> : null}</tbody></table></div>
  </section></div>
}
