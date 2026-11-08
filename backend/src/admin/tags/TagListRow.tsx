"use client"
import React from 'react'
import Link from 'next/link'
import { TAG_PATH, type TagRow } from './tags-model'
export function TagListRow({ tag, canCreate }: { tag: TagRow; canCreate: boolean }) {
  return <tr>
    <td className="t"><Link href={`${TAG_PATH}/${tag.id}`}>{tag.nome}</Link><div className="ra"><Link className="lnk" href={`${TAG_PATH}/${tag.id}`}>Editar</Link>{canCreate ? <><span>|</span><Link className="lnk" href={`${TAG_PATH}/create?copiar=${tag.id}`}>Duplicar</Link></> : null}</div></td>
    <td>{tag.slug ? <span className="bb-tag-slug">{tag.slug}</span> : <span className="bb-tag-empty">-</span>}</td>
    <td>{tag.usosCount ?? '-'}</td>
  </tr>
}
