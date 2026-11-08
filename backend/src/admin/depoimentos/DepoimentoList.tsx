"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { activeDepoimento, moverDepoimento, ordenarDepoimentos } from './depoimento-data'
import { DEPOIMENTO_PATH, type DepoimentoRow } from './depoimento-model'
import { DepoimentoListRow } from './DepoimentoListRow'
const FILTERS = [
  ['todos', 'Todos', (_d: DepoimentoRow) => true],
  ['ativos', 'No ar', activeDepoimento],
  ['inativos', 'Inativos', (d: DepoimentoRow) => !activeDepoimento(d)],
] as const
export function DepoimentoList({ initial, canCreate = true, canUpdate = true }: { initial: DepoimentoRow[]; canCreate?: boolean; canUpdate?: boolean }) {
  const [rows, setRows] = useState(initial)
  const [filter, setFilter] = useState('todos')
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const visible = useMemo(() => ordenarDepoimentos(rows
    .filter(FILTERS.find(f => f[0] === filter)![2])
    .filter(d => `${d.autor} ${d.empresa ?? ''} ${d.texto}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')))), [rows, filter, search])
  // Reordenar so com a lista inteira a vista (sem busca e sem filtro de status).
  const canReorder = canUpdate && !search.trim() && filter === 'todos'
  async function mover(dep: DepoimentoRow, dir: 'up' | 'down') {
    const result = moverDepoimento(rows, dep.id, dir)
    if (!result.changes.length) return
    const previous = rows
    setRows(result.rows); setBusy(true); setError(''); setMessage('')
    try {
      for (const change of result.changes) {
        await requestJSON(`/api/depoimentos/${change.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ordem: change.ordem }) })
      }
      setMessage('Nova ordem salva. O site pode levar alguns minutos para atualizar.')
    } catch (cause) { setRows(previous); setError((cause as Error).message) } finally { setBusy(false) }
  }
  async function toggle(dep: DepoimentoRow) {
    setBusy(true); setError(''); setMessage('')
    try {
      const result = await requestJSON<{ doc: DepoimentoRow }>(`/api/depoimentos/${dep.id}?depth=1`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ativo: !activeDepoimento(dep) }) })
      setRows(current => current.map(item => item.id === dep.id ? result.doc : item))
      setMessage('Alteração salva. O site pode levar alguns minutos para atualizar.')
    } catch (cause) { setError((cause as Error).message) } finally { setBusy(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Depoimentos</h1>{canCreate ? <Link className="btn" href={`${DEPOIMENTO_PATH}/create`}><Icon name="plus" />Adicionar depoimento</Link> : null}</div>
    <p className="sub">Depoimentos de clientes exibidos na home e na página de cases. Use as setas para mudar a ordem e a chave para ligar e desligar.</p>
    <div className="subsub">{FILTERS.map(([key, label, match], index) => <React.Fragment key={key}>{index ? <span className="sep">|</span> : null}<button type="button" className={filter === key ? 'on' : ''} onClick={() => setFilter(key)}>{label} <span className="n">({rows.filter(match).length})</span></button></React.Fragment>)}</div>
    <div className="toolbar"><span className="sp" /><input className="inp search" type="search" aria-label="Buscar depoimentos" placeholder="Buscar depoimentos…" value={search} onChange={event => setSearch(event.target.value)} /></div>
    {canUpdate && (search.trim() || filter !== 'todos') ? <p className="help">Limpe a busca e volte para Todos para reordenar os depoimentos.</p> : null}
    {error ? <p className="bb-error" role="alert">{error}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="bb-table-scroll"><table className="list"><thead><tr>{canReorder ? <th>Ordenar</th> : null}<th>Foto</th><th>Autor</th><th>Depoimento</th><th>Ordem</th><th>Status</th><th>Ativo</th></tr></thead><tbody>{visible.map((d, index) => <DepoimentoListRow
      key={d.id}
      depoimento={d}
      canCreate={canCreate}
      canUpdate={canUpdate}
      reorder={canReorder}
      busy={busy}
      canMoveUp={index > 0}
      canMoveDown={index < visible.length - 1}
      onMove={dir => void mover(d, dir)}
      onToggle={() => void toggle(d)}
    />)}{!visible.length ? <tr><td colSpan={canReorder ? 7 : 6} className="empty">Nenhum depoimento neste filtro.</td></tr> : null}</tbody></table></div>
  </section></div>
}
