"use client"
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'
import { photo } from '../friendly/model'
import { grupoLabel } from './categoria-model'
import { CATEGORIA_PATH, type CategoriaRow } from './categoria-model'
export function CategoriaListRow({ categoria, canCreate }: { categoria: CategoriaRow; canCreate: boolean }) {
  const icone = photo(categoria.icone)
  const eco = categoria.grupo === 'ecologicos'
  return <tr>
    <td>{icone?.url ? <img className="bb-cat-ico" src={icone.url} alt="" /> : <span className="bb-cat-ico vazio" aria-hidden>{categoria.nome.trim().charAt(0).toLocaleUpperCase('pt-BR') || '?'}</span>}</td>
    <td className="t"><Link href={`${CATEGORIA_PATH}/${categoria.id}`}>{categoria.nome}</Link><div className="ra"><Link className="lnk" href={`${CATEGORIA_PATH}/${categoria.id}`}>Editar</Link>{canCreate ? <><span>|</span><Link className="lnk" href={`${CATEGORIA_PATH}/create?copiar=${categoria.id}`}>Duplicar</Link></> : null}</div></td>
    <td><span className={`bb-cat-grp ${eco ? 'eco' : ''}`}>{grupoLabel(categoria.grupo)}</span></td>
    <td>{categoria.ordem ?? 0}</td>
    <td>{categoria.produtosCount ?? 0}</td>
  </tr>
}
