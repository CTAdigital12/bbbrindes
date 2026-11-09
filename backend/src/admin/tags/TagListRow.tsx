"use client"
import React from 'react'
import Link from 'next/link'
import { TAG_PATH, type TagRow } from './tags-model'
export function TagListRow({ tag, canCreate, canDelete = false, busy = false, onRemove }: { tag: TagRow; canCreate: boolean; canDelete?: boolean; busy?: boolean; onRemove?: () => void }) {
  return <tr aria-busy={busy}>
    <td className="t"><Link href={`${TAG_PATH}/${tag.id}`}>{tag.nome}</Link><div className="ra"><Link className="lnk" href={`${TAG_PATH}/${tag.id}`}>Editar</Link>{canCreate ? <><span>|</span><Link className="lnk" href={`${TAG_PATH}/create?copiar=${tag.id}`}>Duplicar</Link></> : null}{canDelete ? <><span>|</span><button type="button" className="lnk red" disabled={busy} onClick={onRemove}>Excluir</button></> : null}</div></td>
    <td>{tag.slug ? <span className="bb-tag-slug">{tag.slug}</span> : <span className="bb-tag-empty">-</span>}</td>
    <td>{tag.usosCount ?? '-'}</td>
  </tr>
}
