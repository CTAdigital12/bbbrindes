"use client"
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'
import { Icon } from '../friendly/icons'
import { LOGO_PATH, type LogoRow } from './logo-model'
type Props = {
  logo: LogoRow; reorder?: boolean; busy?: boolean
  canMoveUp?: boolean; canMoveDown?: boolean; onMove?: (dir: 'up' | 'down') => void
}
export function LogoListRow({ logo, reorder = false, busy = false, canMoveUp = false, canMoveDown = false, onMove }: Props) {
  const nome = logo.nome.trim() || 'Sem nome'
  return <tr aria-busy={busy}>
    {reorder ? <td><div className="bb-logo-mv">
      <button type="button" className="bb-logo-mv-btn" aria-label={`Subir ${nome}`} disabled={busy || !canMoveUp} onClick={() => onMove?.('up')}><Icon name="chevron-up" /></button>
      <button type="button" className="bb-logo-mv-btn" aria-label={`Descer ${nome}`} disabled={busy || !canMoveDown} onClick={() => onMove?.('down')}><Icon name="chevron-down" /></button>
    </div></td> : null}
    <td>{logo.url ? <span className="bb-logo-thumb"><img src={logo.url} alt="" /></span> : <span className="nofoto">Sem arquivo</span>}</td>
    <td className="t"><Link href={`${LOGO_PATH}/${logo.id}`}>{nome}</Link><div className="ra"><Link className="lnk" href={`${LOGO_PATH}/${logo.id}`}>Editar</Link></div></td>
    <td>{logo.ordem ?? 0}</td>
  </tr>
}
