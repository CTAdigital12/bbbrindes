"use client"
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'
import { photo } from '../friendly/model'
import { Icon } from '../friendly/icons'
import { activeDepoimento } from './depoimento-data'
import { DEPOIMENTO_PATH, type DepoimentoRow } from './depoimento-model'
type Props = {
  depoimento: DepoimentoRow; canCreate: boolean; canUpdate: boolean; canDelete?: boolean
  reorder?: boolean; busy?: boolean; canMoveUp?: boolean; canMoveDown?: boolean
  onMove?: (dir: 'up' | 'down') => void; onToggle: () => void; onRemove?: () => void
}
export function DepoimentoListRow({ depoimento, canCreate, canUpdate, canDelete = false, reorder = false, busy = false, canMoveUp = false, canMoveDown = false, onMove, onToggle, onRemove }: Props) {
  const foto = photo(depoimento.foto)
  const active = activeDepoimento(depoimento)
  const nome = depoimento.autor.trim() || 'Sem autor'
  return <tr aria-busy={busy}>
    {reorder ? <td><div className="bb-dep-mv">
      <button type="button" className="bb-dep-mv-btn" aria-label={`Subir ${nome}`} disabled={busy || !canMoveUp} onClick={() => onMove?.('up')}><Icon name="chevron-up" /></button>
      <button type="button" className="bb-dep-mv-btn" aria-label={`Descer ${nome}`} disabled={busy || !canMoveDown} onClick={() => onMove?.('down')}><Icon name="chevron-down" /></button>
    </div></td> : null}
    <td>{foto?.url ? <img className="bb-dep-foto" src={foto.url} alt="" /> : <span className="bb-dep-foto vazio" aria-hidden>{nome.charAt(0).toLocaleUpperCase('pt-BR')}</span>}</td>
    <td className="t"><Link href={`${DEPOIMENTO_PATH}/${depoimento.id}`}>{nome}</Link>{depoimento.empresa ? <div className="bb-dep-empresa">{depoimento.empresa}</div> : null}<div className="ra"><Link className="lnk" href={`${DEPOIMENTO_PATH}/${depoimento.id}`}>Editar</Link>{canCreate ? <><span>|</span><Link className="lnk" href={`${DEPOIMENTO_PATH}/create?copiar=${depoimento.id}`}>Duplicar</Link></> : null}{canDelete ? <><span>|</span><button type="button" className="lnk red" disabled={busy} onClick={() => onRemove?.()}>Excluir</button></> : null}</div></td>
    <td className="bb-dep-col-texto">{depoimento.texto}</td>
    <td>{depoimento.ordem ?? 0}</td>
    <td><span className={`st ${active ? 'ok' : 'off'}`}>{active ? 'No ar' : 'Inativo'}</span></td>
    <td><label className="sw"><input type="checkbox" role="switch" aria-label={`Ativar ${nome}`} checked={active} disabled={!canUpdate || busy} onChange={onToggle} /><span /></label></td>
  </tr>
}
