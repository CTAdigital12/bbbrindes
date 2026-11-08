"use client"
import React from 'react'
import Link from 'next/link'
import { caseTags } from './cases-data'
import { CASE_PATH, type CaseRow } from './cases-model'
export function CaseListRow({ caseItem, canCreate }: { caseItem: CaseRow; canCreate: boolean }) {
  const tags = caseTags(caseItem)
  return <tr>
    <td><span className="bb-cases-brand" aria-hidden>{caseItem.cliente.trim() || '-'}</span></td>
    <td className="t"><Link href={`${CASE_PATH}/${caseItem.id}`}>{caseItem.titulo || '(sem título)'}</Link><div className="ra"><Link className="lnk" href={`${CASE_PATH}/${caseItem.id}`}>Editar</Link>{canCreate ? <><span>|</span><Link className="lnk" href={`${CASE_PATH}/create?copiar=${caseItem.id}`}>Duplicar</Link></> : null}</div></td>
    <td>{caseItem.segmento?.trim() || '-'}</td>
    <td>{tags.length ? <div className="bb-cases-tags">{tags.map(t => <span className="bb-cases-tag" key={t.id}>{t.nome}</span>)}</div> : '-'}</td>
  </tr>
}
