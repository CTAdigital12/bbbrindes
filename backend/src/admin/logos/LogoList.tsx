"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { moverLogo, ordenarLogos } from './logo-data'
import { LOGO_PATH, type LogoRow } from './logo-model'
import { LogoListRow } from './LogoListRow'
export function LogoList({ initial, canCreate = true, canUpdate = true, canDelete = true }: { initial: LogoRow[]; canCreate?: boolean; canUpdate?: boolean; canDelete?: boolean }) {
  const [rows, setRows] = useState(initial)
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const visible = useMemo(() => ordenarLogos(rows.filter(l => l.nome.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')))), [rows, search])
  const canReorder = canUpdate && !search.trim()
  async function mover(logo: LogoRow, dir: 'up' | 'down') {
    const result = moverLogo(rows, logo.id, dir)
    if (!result.changes.length) return
    const previous = rows
    setRows(result.rows); setBusy(true); setError(''); setMessage('')
    try {
      for (const change of result.changes) {
        await requestJSON(`/api/logos/${change.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ordem: change.ordem }) })
      }
      setMessage('Nova ordem salva. O site pode levar alguns minutos para atualizar.')
    } catch (cause) { setRows(previous); setError((cause as Error).message) } finally { setBusy(false) }
  }
  async function remove(logo: LogoRow) {
    if (!window.confirm(`Excluir o logo "${logo.nome}"? Esta ação não pode ser desfeita.`)) return
    setBusy(true); setError(''); setMessage('')
    try {
      await requestJSON(`/api/logos/${logo.id}`, { method: 'DELETE' })
      setRows(current => current.filter(item => item.id !== logo.id))
      setMessage('Logo excluído.')
    } catch (cause) { setError((cause as Error).message) } finally { setBusy(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Logos</h1>{canCreate ? <Link className="btn" href={`${LOGO_PATH}/create`}><Icon name="plus" />Adicionar logo</Link> : null}</div>
    <p className="sub">Logos das marcas no marquee da home. Suba o arquivo (SVG ou PNG) e use as setas para ordenar.</p>
    <div className="toolbar"><span className="sp" /><input className="inp search" type="search" aria-label="Buscar logos" placeholder="Buscar logos…" value={search} onChange={event => setSearch(event.target.value)} /></div>
    {canUpdate && search.trim() ? <p className="help">Limpe a busca para reordenar os logos.</p> : null}
    {error ? <p className="bb-error" role="alert">{error}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="bb-table-scroll"><table className="list"><thead><tr>{canReorder ? <th>Ordenar</th> : null}<th>Logo</th><th>Marca</th><th>Ordem</th></tr></thead><tbody>{visible.map((l, index) => <LogoListRow
      key={l.id}
      logo={l}
      canDelete={canDelete}
      reorder={canReorder}
      busy={busy}
      canMoveUp={index > 0}
      canMoveDown={index < visible.length - 1}
      onMove={dir => void mover(l, dir)}
      onRemove={() => void remove(l)}
    />)}{!visible.length ? <tr><td colSpan={canReorder ? 4 : 3} className="empty">Nenhum logo encontrado.</td></tr> : null}</tbody></table></div>
  </section></div>
}
