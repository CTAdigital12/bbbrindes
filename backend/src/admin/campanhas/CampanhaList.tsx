"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { activeCampanha } from './campanha-data'
import { CAMPANHA_PATH, type CampanhaRow } from './campanha-model'
import { CampanhaListRow } from './CampanhaListRow'
const FILTERS = [['todos', 'Todas', (_c: CampanhaRow) => true], ['ativos', 'No ar', activeCampanha], ['inativos', 'Inativas', (c: CampanhaRow) => !activeCampanha(c)]] as const
export function CampanhaList({ initial, canCreate = true, canUpdate = true }: { initial: CampanhaRow[]; canCreate?: boolean; canUpdate?: boolean }) {
  const [rows, setRows] = useState(initial)
  const [filter, setFilter] = useState('todos')
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState<number>()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const visible = useMemo(() => rows.filter(FILTERS.find(f => f[0] === filter)![2]).filter(c => c.nome.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))), [rows, filter, search])
  async function toggle(c: CampanhaRow) {
    setBusy(c.id); setError(''); setMessage('')
    try {
      const result = await requestJSON<{ doc: CampanhaRow }>(`/api/campanhas/${c.id}?depth=1`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ativo: !activeCampanha(c) }) })
      setRows(current => current.map(item => item.id === c.id ? result.doc : item))
      setMessage('Alteração salva. O site pode levar alguns minutos para atualizar.')
    } catch (cause) { setError((cause as Error).message) } finally { setBusy(undefined) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Campanhas</h1>{canCreate ? <Link className="btn" href={`${CAMPANHA_PATH}/create`}><Icon name="plus" />Adicionar campanha</Link> : null}</div>
    <p className="sub">Datas e ações do site (menu, home e página da campanha). Ligue e desligue pela chave.</p>
    <div className="subsub">{FILTERS.map(([key, label, match], index) => <React.Fragment key={key}>{index ? <span className="sep">|</span> : null}<button type="button" className={filter === key ? 'on' : ''} onClick={() => setFilter(key)}>{label} <span className="n">({rows.filter(match).length})</span></button></React.Fragment>)}</div>
    <div className="toolbar"><span className="sp" /><input className="inp search" type="search" aria-label="Buscar campanhas" placeholder="Buscar campanhas…" value={search} onChange={event => setSearch(event.target.value)} /></div>
    {error ? <p className="bb-error" role="alert">{error}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="bb-table-scroll"><table className="list"><thead><tr><th>Imagem</th><th>Campanha</th><th>Mês</th><th>Produtos</th><th>Status</th><th>Ativo</th></tr></thead><tbody>{visible.map(c => <CampanhaListRow key={c.id} campanha={c} busy={busy !== undefined} canCreate={canCreate} canUpdate={canUpdate} onToggle={() => void toggle(c)} />)}{!visible.length ? <tr><td colSpan={6} className="empty">Nenhuma campanha neste filtro.</td></tr> : null}</tbody></table></div>
  </section></div>
}
