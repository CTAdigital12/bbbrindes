"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Icon } from '../friendly/icons'
import { ordenarTags } from './tags-data'
import { TAG_PATH, type TagRow } from './tags-model'
import { TagListRow } from './TagListRow'
export function TagList({ initial, canCreate = true }: { initial: TagRow[]; canCreate?: boolean }) {
  const [rows] = useState(initial)
  const [search, setSearch] = useState('')
  const visible = useMemo(() => ordenarTags(rows
    .filter(t => t.nome.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')))), [rows, search])
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Tags</h1>{canCreate ? <Link className="btn" href={`${TAG_PATH}/create`}><Icon name="plus" />Adicionar tag</Link> : null}</div>
    <p className="sub">Tags compartilhadas para distribuir e cruzar conteudo entre blog, cases e imprensa. O endereco (slug) e gerado do nome. A coluna "Usos" mostra em quantos conteudos a tag esta marcada.</p>
    <div className="toolbar"><span className="sp" /><input className="inp search" type="search" aria-label="Buscar tags" placeholder="Buscar tags…" value={search} onChange={event => setSearch(event.target.value)} /></div>
    <div className="bb-table-scroll"><table className="list"><thead><tr><th>Tag</th><th>Endereco (slug)</th><th>Usos</th></tr></thead><tbody>
      {visible.map(t => <TagListRow key={t.id} tag={t} canCreate={canCreate} />)}
      {!visible.length ? <tr><td colSpan={3} className="empty">{search.trim() ? 'Nenhuma tag encontrada.' : 'Nenhuma tag ainda. Crie a primeira.'}</td></tr> : null}
    </tbody></table></div>
  </section></div>
}
