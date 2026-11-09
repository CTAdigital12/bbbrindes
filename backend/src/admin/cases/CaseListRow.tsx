"use client"
import React from 'react'
import Link from 'next/link'
import { caseTags } from './cases-data'
import { CASE_PATH, type CaseRow } from './cases-model'
export function CaseListRow({ caseItem, canCreate, canDelete, busy, onRemove }: { caseItem: CaseRow; canCreate: boolean; canDelete: boolean; busy: boolean; onRemove: () => void }) {
  const tags = caseTags(caseItem)
  return <tr>
    <td><span className="bb-cases-brand" aria-hidden>{caseItem.cliente.trim() || '-'}</span></td>
    <td className="t"><Link href={`${CASE_PATH}/${caseItem.id}`}>{caseItem.titulo || '(sem título)'}</Link><div className="ra"><Link className="lnk" href={`${CASE_PATH}/${caseItem.id}`}>Editar</Link>{canCreate ? <><span>|</span><Link className="lnk" href={`${CASE_PATH}/create?copiar=${caseItem.id}`}>Duplicar</Link></> : null}{canDelete ? <><span>|</span><button type="button" className="lnk red" disabled={busy} onClick={onRemove}>Excluir</button></> : null}</div></td>
    <td>{caseItem.segmento?.trim() || '-'}</td>
    <td>{tags.length ? <div className="bb-cases-tags">{tags.map(t => <span className="bb-cases-tag" key={t.id}>{t.nome}</span>)}</div> : '-'}</td>
  </tr>
}
