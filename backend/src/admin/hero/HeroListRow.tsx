"use client"
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'
import { photo } from '../friendly/model'
import { activeHero, heroPeriod } from './hero-data'
import { HERO_PATH, type HeroBanner } from './hero-model'
type Props = { banner: HeroBanner; busy: boolean; canCreate: boolean; canUpdate: boolean; canDelete?: boolean; onToggle: () => void; onPreview: () => void; onRemove?: () => void }
export function HeroListRow({ banner, busy, canCreate, canUpdate, canDelete = false, onToggle, onPreview, onRemove }: Props) {
  const image = photo(banner.imagemDesktop)
  const active = activeHero(banner)
  return <tr aria-busy={busy}><td>{banner.ordem ?? 0}</td><td>{image?.url ? <img className="thumb wide" src={image.url} alt="" /> : <span className="nofoto">Sem imagem</span>}</td>
    <td className="t"><Link href={`${HERO_PATH}/${banner.id}`}>{banner.nome}</Link><div className="ra"><Link className="lnk" href={`${HERO_PATH}/${banner.id}`}>Editar</Link><span>|</span>{canCreate ? <><Link className="lnk" href={`${HERO_PATH}/create?copiar=${banner.id}`}>Duplicar</Link><span>|</span></> : null}<button type="button" className="lnk" onClick={onPreview}>Visualizar</button>{canDelete ? <><span>|</span><button type="button" className="lnk red" disabled={busy} onClick={() => onRemove?.()}>Excluir</button></> : null}</div></td>
    <td>{heroPeriod(banner)}</td><td><span className={`st ${banner.imagemMobile ? 'ok' : 'rasc'}`}>{banner.imagemMobile ? 'Tem imagem' : 'Falta imagem'}</span></td>
    <td><span className={`st ${active ? 'ok' : 'off'}`}>{active ? 'Ativo' : 'Inativo'}</span></td>
    <td><label className="sw"><input type="checkbox" role="switch" aria-label={`Ativar ${banner.nome}`} checked={active} disabled={!canUpdate || busy} onChange={onToggle} /><span /></label></td>
  </tr>
}
