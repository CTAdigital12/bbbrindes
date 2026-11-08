"use client"
import React from 'react'
import Link from 'next/link'
import { dateLabel } from '../friendly/model'
import { USER_PATH, type UserRow } from './users-model'
type Props = { user: UserRow; busy: boolean; canUpdate: boolean; canDelete: boolean; isSelf: boolean; onRemove: () => void }
export function UserListRow({ user, busy, canUpdate, canDelete, isSelf, onRemove }: Props) {
  return <tr aria-busy={busy}>
    <td className="t"><Link href={`${USER_PATH}/${user.id}`}>{user.email}</Link>{isSelf ? <span className="bb-user-self">você</span> : null}</td>
    <td>{dateLabel(user.createdAt)}</td>
    <td><div className="ra">{canUpdate ? <Link className="lnk" href={`${USER_PATH}/${user.id}`}>Editar</Link> : null}{canDelete && !isSelf ? <><span>|</span><button type="button" className="lnk red" disabled={busy} onClick={onRemove}>Remover</button></> : null}</div></td>
  </tr>
}
