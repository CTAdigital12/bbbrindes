"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Icon } from '../friendly/icons'
import { requestJSON } from '../friendly/api'
import { POST_PATH, type PostRow } from './post-model'
import { PostListRow } from './PostListRow'
export function PostList({ initial, canCreate = true, canDelete = true }: { initial: PostRow[]; canCreate?: boolean; canDelete?: boolean }) {
  const [rows, setRows] = useState(initial)
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState<number>()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  async function remove(post: PostRow) {
    if (!window.confirm(`Excluir "${post.titulo || 'este post'}"? Esta ação não pode ser desfeita.`)) return
    setBusy(post.id); setError(''); setMessage('')
    try {
      await requestJSON(`/api/posts/${post.id}`, { method: 'DELETE' })
      setRows(prev => prev.filter(p => p.id !== post.id))
      setMessage('Post excluído.')
    } catch (cause) { setError((cause as Error).message) } finally { setBusy(undefined) }
  }
  const visible = useMemo(() => rows.filter(p => p.titulo.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))), [rows, search])
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Blog</h1>{canCreate ? <Link className="btn" href={`${POST_PATH}/create`}><Icon name="plus" />Adicionar post</Link> : null}</div>
    <p className="sub">Artigos do blog da BB Brindes. O mais recente aparece primeiro, pela data.</p>
    <div className="toolbar"><span className="sp" /><input className="inp search" type="search" aria-label="Buscar posts" placeholder="Buscar posts…" value={search} onChange={e => setSearch(e.target.value)} /></div>
    {error ? <p className="bb-error" role="alert">{error}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="bb-table-scroll"><table className="list"><thead><tr><th>Capa</th><th>Post</th><th>Data</th><th>Autor</th><th>Tags</th></tr></thead><tbody>{visible.map(p => <PostListRow key={p.id} post={p} canCreate={canCreate} canDelete={canDelete} busy={busy === p.id} onRemove={() => void remove(p)} />)}{!visible.length ? <tr><td colSpan={5} className="empty">Nenhum post encontrado.</td></tr> : null}</tbody></table></div>
  </section></div>
}
