"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Icon } from '../friendly/icons'
import { requestJSON } from '../friendly/api'
import { CASE_PATH, type CaseRow } from './cases-model'
import { CaseListRow } from './CaseListRow'
// Lista amigavel dos cases (prova social). Sem toggle: a collection nao tem campo
// de publicado/ativo. So busca por cliente, titulo e segmento.
export function CaseList({ initial, canCreate = true, canDelete = true }: { initial: CaseRow[]; canCreate?: boolean; canDelete?: boolean }) {
  const [rows, setRows] = useState(initial)
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState<number>()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  async function remove(caseItem: CaseRow) {
    if (!window.confirm(`Excluir "${caseItem.titulo || caseItem.cliente}"? Esta ação não pode ser desfeita.`)) return
    setBusy(caseItem.id); setError(''); setMessage('')
    try {
      await requestJSON(`/api/cases/${caseItem.id}`, { method: 'DELETE' })
      setRows(prev => prev.filter(c => c.id !== caseItem.id))
      setMessage('Case excluído.')
    } catch (cause) { setError((cause as Error).message) } finally { setBusy(undefined) }
  }
  const visible = useMemo(() => {
    const termo = search.toLocaleLowerCase('pt-BR')
    return rows.filter(c => `${c.cliente} ${c.titulo} ${c.segmento ?? ''}`.toLocaleLowerCase('pt-BR').includes(termo))
  }, [rows, search])
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Cases</h1>{canCreate ? <Link className="btn" href={`${CASE_PATH}/create`}><Icon name="plus" />Adicionar case</Link> : null}</div>
    <p className="sub">Cases e prova social do site. Cada card mostra uma faixa com o nome do cliente, o segmento e o título. Após salvar, a publicação leva alguns minutos.</p>
    <div className="subsub"><span>Todos <span className="n">({rows.length})</span></span></div>
    <div className="toolbar"><span className="sp" /><input className="inp search" type="search" aria-label="Buscar cases" placeholder="Buscar cases…" value={search} onChange={event => setSearch(event.target.value)} /></div>
    {error ? <p className="bb-error" role="alert">{error}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="bb-table-scroll"><table className="list"><thead><tr><th>Cliente</th><th>Case</th><th>Segmento</th><th>Tags</th></tr></thead><tbody>{visible.map(c => <CaseListRow key={c.id} caseItem={c} canCreate={canCreate} canDelete={canDelete} busy={busy === c.id} onRemove={() => void remove(c)} />)}{!visible.length ? <tr><td colSpan={4} className="empty">Nenhum case encontrado.</td></tr> : null}</tbody></table></div>
  </section></div>
}
