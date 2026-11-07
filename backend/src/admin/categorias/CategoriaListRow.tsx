"use client"
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'
import { photo } from '../friendly/model'
import { Icon } from '../friendly/icons'
import { grupoLabel } from './categoria-model'
import { CATEGORIA_PATH, type CategoriaRow } from './categoria-model'
type Props = {
  categoria: CategoriaRow; canCreate: boolean
  reorder?: boolean; busy?: boolean; canMoveUp?: boolean; canMoveDown?: boolean; onMove?: (dir: 'up' | 'down') => void
}
export function CategoriaListRow({ categoria, canCreate, reorder = false, busy = false, canMoveUp = false, canMoveDown = false, onMove }: Props) {
  const icone = photo(categoria.icone)
  const eco = categoria.grupo === 'ecologicos'
  return <tr aria-busy={busy}>
    {reorder ? <td><div className="bb-cat-mv">
      <button type="button" className="bb-cat-mv-btn" aria-label={`Subir ${categoria.nome}`} disabled={busy || !canMoveUp} onClick={() => onMove?.('up')}><Icon name="chevron-up" /></button>
      <button type="button" className="bb-cat-mv-btn" aria-label={`Descer ${categoria.nome}`} disabled={busy || !canMoveDown} onClick={() => onMove?.('down')}><Icon name="chevron-down" /></button>
    </div></td> : null}
    <td>{icone?.url ? <img className="bb-cat-ico" src={icone.url} alt="" /> : <span className="bb-cat-ico vazio" aria-hidden>{categoria.nome.trim().charAt(0).toLocaleUpperCase('pt-BR') || '?'}</span>}</td>
    <td className="t"><Link href={`${CATEGORIA_PATH}/${categoria.id}`}>{categoria.nome}</Link><div className="ra"><Link className="lnk" href={`${CATEGORIA_PATH}/${categoria.id}`}>Editar</Link>{canCreate ? <><span>|</span><Link className="lnk" href={`${CATEGORIA_PATH}/create?copiar=${categoria.id}`}>Duplicar</Link></> : null}</div></td>
    <td><span className={`bb-cat-grp ${eco ? 'eco' : ''}`}>{grupoLabel(categoria.grupo)}</span></td>
    <td>{categoria.ordem ?? 0}</td>
    <td>{categoria.produtosCount ?? 0}</td>
  </tr>
}
