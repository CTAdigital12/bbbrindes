"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Icon } from '../friendly/icons'
import { POST_PATH, type PostRow } from './post-model'
import { PostListRow } from './PostListRow'
export function PostList({ initial, canCreate = true }: { initial: PostRow[]; canCreate?: boolean }) {
  const [rows] = useState(initial)
  const [search, setSearch] = useState('')
  const visible = useMemo(() => rows.filter(p => p.titulo.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))), [rows, search])
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Blog</h1>{canCreate ? <Link className="btn" href={`${POST_PATH}/create`}><Icon name="plus" />Adicionar post</Link> : null}</div>
    <p className="sub">Artigos do blog da BB Brindes. O mais recente aparece primeiro, pela data.</p>
    <div className="toolbar"><span className="sp" /><input className="inp search" type="search" aria-label="Buscar posts" placeholder="Buscar posts…" value={search} onChange={e => setSearch(e.target.value)} /></div>
    <div className="bb-table-scroll"><table className="list"><thead><tr><th>Capa</th><th>Post</th><th>Data</th><th>Autor</th><th>Tags</th></tr></thead><tbody>{visible.map(p => <PostListRow key={p.id} post={p} canCreate={canCreate} />)}{!visible.length ? <tr><td colSpan={5} className="empty">Nenhum post encontrado.</td></tr> : null}</tbody></table></div>
  </section></div>
}
