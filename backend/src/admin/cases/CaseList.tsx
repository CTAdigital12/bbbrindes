"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Icon } from '../friendly/icons'
import { CASE_PATH, type CaseRow } from './cases-model'
import { CaseListRow } from './CaseListRow'
// Lista amigavel dos cases (prova social). Sem toggle: a collection nao tem campo
// de publicado/ativo. So busca por cliente, titulo e segmento.
export function CaseList({ initial, canCreate = true }: { initial: CaseRow[]; canCreate?: boolean }) {
  const [rows] = useState(initial)
  const [search, setSearch] = useState('')
  const visible = useMemo(() => {
    const termo = search.toLocaleLowerCase('pt-BR')
    return rows.filter(c => `${c.cliente} ${c.titulo} ${c.segmento ?? ''}`.toLocaleLowerCase('pt-BR').includes(termo))
  }, [rows, search])
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Cases</h1>{canCreate ? <Link className="btn" href={`${CASE_PATH}/create`}><Icon name="plus" />Adicionar case</Link> : null}</div>
    <p className="sub">Cases e prova social do site. Cada card mostra uma faixa com o nome do cliente, o segmento e o título. Após salvar, a publicação leva alguns minutos.</p>
    <div className="subsub"><span>Todos <span className="n">({rows.length})</span></span></div>
    <div className="toolbar"><span className="sp" /><input className="inp search" type="search" aria-label="Buscar cases" placeholder="Buscar cases…" value={search} onChange={event => setSearch(event.target.value)} /></div>
    <div className="bb-table-scroll"><table className="list"><thead><tr><th>Cliente</th><th>Case</th><th>Segmento</th><th>Tags</th></tr></thead><tbody>{visible.map(c => <CaseListRow key={c.id} caseItem={c} canCreate={canCreate} />)}{!visible.length ? <tr><td colSpan={4} className="empty">Nenhum case encontrado.</td></tr> : null}</tbody></table></div>
  </section></div>
}
