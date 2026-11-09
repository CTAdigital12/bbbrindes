"use client"
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'
import { photo } from '../friendly/model'
import { activeCampanha, produtoIDs } from './campanha-data'
import { CAMPANHA_PATH, type CampanhaRow } from './campanha-model'
type Props = { campanha: CampanhaRow; busy: boolean; canCreate: boolean; canUpdate: boolean; canDelete?: boolean; onToggle: () => void; onRemove?: () => void }
export function CampanhaListRow({ campanha, busy, canCreate, canUpdate, canDelete = false, onToggle, onRemove }: Props) {
  const image = photo(campanha.imagem)
  const active = activeCampanha(campanha)
  return <tr aria-busy={busy}>
    <td>{image?.url ? <img className="thumb" src={image.url} alt="" /> : <span className="nofoto">Sem imagem</span>}</td>
    <td className="t"><Link href={`${CAMPANHA_PATH}/${campanha.id}`}>{campanha.nome}</Link><div className="ra"><Link className="lnk" href={`${CAMPANHA_PATH}/${campanha.id}`}>Editar</Link>{canCreate ? <><span>|</span><Link className="lnk" href={`${CAMPANHA_PATH}/create?copiar=${campanha.id}`}>Duplicar</Link></> : null}{canDelete ? <><span>|</span><button type="button" className="lnk red" disabled={busy} onClick={onRemove}>Excluir</button></> : null}</div></td>
    <td>{campanha.mes || '—'}</td>
    <td>{produtoIDs(campanha).length}</td>
    <td><span className={`st ${active ? 'ok' : 'off'}`}>{active ? 'No ar' : 'Inativa'}</span></td>
    <td><label className="sw"><input type="checkbox" role="switch" aria-label={`Ativar ${campanha.nome}`} checked={active} disabled={!canUpdate || busy} onChange={onToggle} /><span /></label></td>
  </tr>
}
