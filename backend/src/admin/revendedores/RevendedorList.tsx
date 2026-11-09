"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { requestJSON } from '../friendly/api'
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

export function RevendedorList({ initial, canCreate = true, canUpdate = true, canDelete = true }: { initial: RevendedorRow[]; canCreate?: boolean; canUpdate?: boolean; canDelete?: boolean }) {
  const [rows, setRows] = useState(initial)
  const [filter, setFilter] = useState('todos')
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState<number>()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const visible = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('pt-BR')
    return rows.filter(FILTERS.find(f => f[0] === filter)![2]).filter(r => !q || matchSearch(r, q))
  }, [rows, filter, search])
  async function remove(r: RevendedorRow) {
    if (!window.confirm(`Excluir o revendedor "${r.empresa || r.responsavel || r.email}"? Esta ação não pode ser desfeita.`)) return
    setBusy(r.id); setError(''); setMessage('')
    try {
      await requestJSON(`/api/revendedores/${r.id}`, { method: 'DELETE' })
      setRows(current => current.filter(x => x.id !== r.id))
      setMessage('Revendedor excluído.')
    } catch (cause) { setError((cause as Error).message) } finally { setBusy(undefined) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Revendedores</h1>{canCreate ? <Link className="btn" href={`${REVENDEDOR_PATH}/create`}><Icon name="plus" />Adicionar revendedor</Link> : null}</div>
    <p className="sub">Contas do portal de revenda. Aprovar um revendedor (Ativo) libera o login e exige a tabela de preço (nível) no mesmo passo.</p>
    <div className="subsub">{FILTERS.map(([key, label, match], index) => <React.Fragment key={key}>{index ? <span className="sep">|</span> : null}<button type="button" className={filter === key ? 'on' : ''} onClick={() => setFilter(key)}>{label} <span className="n">({rows.filter(match).length})</span></button></React.Fragment>)}</div>
    <div className="toolbar"><span className="sp" /><input className="inp search" type="search" aria-label="Buscar por empresa ou CNPJ" placeholder="Buscar por empresa ou CNPJ…" value={search} onChange={event => setSearch(event.target.value)} /></div>
    {error ? <p className="bb-error" role="alert">{error}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="bb-table-scroll"><table className="list"><thead><tr><th>Empresa</th><th>CNPJ</th><th>Responsável</th><th>Nível (tabela)</th><th>Status</th></tr></thead><tbody>{visible.map(r => <RevendedorListRow key={r.id} revendedor={r} canUpdate={canUpdate} canDelete={canDelete} busy={busy === r.id} onRemove={() => void remove(r)} />)}{!visible.length ? <tr><td colSpan={5} className="empty">Nenhum revendedor neste filtro.</td></tr> : null}</tbody></table></div>
  </section></div>
}
