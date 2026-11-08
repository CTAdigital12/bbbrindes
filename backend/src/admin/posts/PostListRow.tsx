"use client"
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'
import { photo } from '../friendly/model'
import { tagIDs } from './post-data'
import { dateShort, POST_PATH, type PostRow } from './post-model'
export function PostListRow({ post, canCreate }: { post: PostRow; canCreate: boolean }) {
  const capa = photo(post.capa)
  return <tr>
    <td>{capa?.url ? <img className="thumb" src={capa.url} alt="" /> : <span className="nofoto">Sem capa</span>}</td>
    <td className="t"><Link href={`${POST_PATH}/${post.id}`}>{post.titulo || 'Sem título'}</Link><div className="ra"><Link className="lnk" href={`${POST_PATH}/${post.id}`}>Editar</Link>{canCreate ? <><span>|</span><Link className="lnk" href={`${POST_PATH}/create?copiar=${post.id}`}>Duplicar</Link></> : null}</div></td>
    <td>{dateShort(post.data)}</td>
    <td>{post.autor || '-'}</td>
    <td>{tagIDs(post).length}</td>
  </tr>
}
