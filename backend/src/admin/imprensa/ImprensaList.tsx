"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Icon } from '../friendly/icons'
import { requestJSON } from '../friendly/api'
import { IMPRENSA_PATH, type ImprensaRow } from './imprensa-model'
import { ImprensaListRow } from './ImprensaListRow'
// Lista amigavel das materias de imprensa. Sem toggle: a collection nao tem campo
// de publicado/ativo. Busca por titulo e veiculo; ordem ja vem por data (recente
// primeiro) do servidor.
export function ImprensaList({ initial, canCreate = true, canDelete = true }: { initial: ImprensaRow[]; canCreate?: boolean; canDelete?: boolean }) {
  const [rows, setRows] = useState(initial)
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState<number>()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  async function remove(materia: ImprensaRow) {
    if (!window.confirm(`Excluir "${materia.titulo || 'esta matéria'}"? Esta ação não pode ser desfeita.`)) return
    setBusy(materia.id); setError(''); setMessage('')
    try {
      await requestJSON(`/api/imprensa/${materia.id}`, { method: 'DELETE' })
      setRows(prev => prev.filter(m => m.id !== materia.id))
      setMessage('Matéria excluída.')
    } catch (cause) { setError((cause as Error).message) } finally { setBusy(undefined) }
  }
  const visible = useMemo(() => {
    const termo = search.toLocaleLowerCase('pt-BR')
    return rows.filter(m => `${m.titulo} ${m.veiculo}`.toLocaleLowerCase('pt-BR').includes(termo))
  }, [rows, search])
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Imprensa</h1>{canCreate ? <Link className="btn" href={`${IMPRENSA_PATH}/create`}><Icon name="plus" />Adicionar matéria</Link> : null}</div>
    <p className="sub">Clipping de imprensa do site (BB Brindes e Grupo BB na mídia). No card da página aparecem o veículo e o título. Após salvar, a publicação leva alguns minutos.</p>
    <div className="subsub"><span>Todas <span className="n">({rows.length})</span></span></div>
    <div className="toolbar"><span className="sp" /><input className="inp search" type="search" aria-label="Buscar matérias" placeholder="Buscar matérias…" value={search} onChange={event => setSearch(event.target.value)} /></div>
    {error ? <p className="bb-error" role="alert">{error}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="bb-table-scroll"><table className="list"><thead><tr><th>Matéria</th><th>Veículo</th><th>Data</th><th>Tags</th><th>Link</th></tr></thead><tbody>{visible.map(m => <ImprensaListRow key={m.id} materia={m} canCreate={canCreate} canDelete={canDelete} busy={busy === m.id} onRemove={() => void remove(m)} />)}{!visible.length ? <tr><td colSpan={5} className="empty">Nenhuma matéria encontrada.</td></tr> : null}</tbody></table></div>
  </section></div>
}
