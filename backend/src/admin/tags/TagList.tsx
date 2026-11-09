"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { ordenarTags } from './tags-data'
import { TAG_PATH, type TagRow } from './tags-model'
import { TagListRow } from './TagListRow'
export function TagList({ initial, canCreate = true, canDelete = true }: { initial: TagRow[]; canCreate?: boolean; canDelete?: boolean }) {
  const [rows, setRows] = useState(initial)
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState<number>()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const visible = useMemo(() => ordenarTags(rows
    .filter(t => t.nome.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')))), [rows, search])
  async function remove(tag: TagRow) {
    if (!window.confirm(`Excluir "${tag.nome}"? Esta ação não pode ser desfeita.`)) return
    setBusy(tag.id); setError(''); setMessage('')
    try {
      await requestJSON(`/api/tags/${tag.id}`, { method: 'DELETE' })
      setRows(prev => prev.filter(t => t.id !== tag.id))
      setMessage('Tag excluída.')
    } catch (cause) { setError((cause as Error).message) } finally { setBusy(undefined) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Tags</h1>{canCreate ? <Link className="btn" href={`${TAG_PATH}/create`}><Icon name="plus" />Adicionar tag</Link> : null}</div>
    <p className="sub">Tags compartilhadas para distribuir e cruzar conteudo entre blog, cases e imprensa. O endereco (slug) e gerado do nome. A coluna "Usos" mostra em quantos conteudos a tag esta marcada.</p>
    <div className="toolbar"><span className="sp" /><input className="inp search" type="search" aria-label="Buscar tags" placeholder="Buscar tags…" value={search} onChange={event => setSearch(event.target.value)} /></div>
    {error ? <p className="bb-error" role="alert">{error}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="bb-table-scroll"><table className="list"><thead><tr><th>Tag</th><th>Endereco (slug)</th><th>Usos</th></tr></thead><tbody>
      {visible.map(t => <TagListRow key={t.id} tag={t} canCreate={canCreate} canDelete={canDelete} busy={busy === t.id} onRemove={() => void remove(t)} />)}
      {!visible.length ? <tr><td colSpan={3} className="empty">{search.trim() ? 'Nenhuma tag encontrada.' : 'Nenhuma tag ainda. Crie a primeira.'}</td></tr> : null}
    </tbody></table></div>
  </section></div>
}
