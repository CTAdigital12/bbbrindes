"use client"
import React from 'react'
import Link from 'next/link'
import { dateLabelBR, materiaTags } from './imprensa-data'
import { IMPRENSA_PATH, type ImprensaRow } from './imprensa-model'
export function ImprensaListRow({ materia, canCreate, canDelete, busy, onRemove }: { materia: ImprensaRow; canCreate: boolean; canDelete: boolean; busy: boolean; onRemove: () => void }) {
  const tags = materiaTags(materia)
  return <tr>
    <td className="t"><Link href={`${IMPRENSA_PATH}/${materia.id}`}>{materia.titulo || '(sem título)'}</Link><div className="ra"><Link className="lnk" href={`${IMPRENSA_PATH}/${materia.id}`}>Editar</Link>{canCreate ? <><span>|</span><Link className="lnk" href={`${IMPRENSA_PATH}/create?copiar=${materia.id}`}>Duplicar</Link></> : null}{canDelete ? <><span>|</span><button type="button" className="lnk red" disabled={busy} onClick={onRemove}>Excluir</button></> : null}</div></td>
    <td>{materia.veiculo?.trim() || '-'}</td>
    <td>{dateLabelBR(materia.data)}</td>
    <td>{tags.length ? <div className="bb-imp-tags">{tags.map(t => <span className="bb-imp-tag" key={t.id}>{t.nome}</span>)}</div> : '-'}</td>
    <td>{materia.url?.trim() ? <a className="lnk" href={materia.url} target="_blank" rel="noreferrer">Abrir</a> : '-'}</td>
  </tr>
}
