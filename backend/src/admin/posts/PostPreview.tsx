"use client"
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { photo } from '../friendly/model'
import { plainText } from '../friendly/product-data'
import { dateShort, tagLabel, type PostDraft, type Tag } from './post-model'
// Previa fiel ao card do blog do site (.blog .post): capa, selo "Artigo", titulo e
// resumo. Abaixo, um resumo da pagina do artigo (data, autor e o inicio do texto).
export function PostPreview({ post }: { post: PostDraft }) {
  const capa = photo(post.capa)?.url
  const titulo = post.titulo.trim() || 'Título do post'
  const resumo = post.resumo?.trim()
  const conteudo = plainText(post.conteudo).trim()
  const tags = post.tags ?? []
  return <div className="bb-blog-preview">
    <div className="bb-blog-preview-bar"><b>Prévia</b><span className="help">Ilustrativa. Confira o site após publicar.</span></div>
    <article className="bb-blog-card">
      <div className="bb-blog-ph">{capa ? <img src={capa} alt="" /> : <span className="bb-blog-noimg">Sem capa</span>}</div>
      <div className="bb-blog-bd">
        <span className="bb-blog-chip">Artigo</span>
        <h3>{titulo}</h3>
        {resumo ? <p className="bb-blog-resumo">{resumo}</p> : <p className="bb-blog-resumo bb-blog-empty">Sem resumo ainda.</p>}
        <div className="bb-blog-meta"><span>{dateShort(post.data)}</span>{post.autor ? <span>por {post.autor}</span> : null}</div>
        {tags.length ? <div className="bb-blog-tags">{tags.map((t: Tag | number) => <span key={typeof t === 'number' ? t : t.id} className="bb-blog-tag">{tagLabel(t)}</span>)}</div> : null}
      </div>
    </article>
    {conteudo ? <div className="bb-blog-body"><span className="bb-blog-sec">Página do artigo</span><p>{conteudo}</p></div> : null}
  </div>
}
