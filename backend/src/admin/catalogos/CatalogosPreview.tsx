'use client'
import React from 'react'
import type { CatalogoContent } from './catalogos-model'
// Previa fiel da pagina /catalogos: breadcrumb, titulo + intro, a moldura do
// flipbook (placeholder, nao embute o heyzine ao vivo no admin) e os cards de
// atalho como aparecem abaixo do flipbook. Ilustrativa.
export function CatalogosPreview({ cat }: { cat: CatalogoContent }) {
  const itens = (cat.itens ?? []).filter(i => i.nome?.trim())
  return <div className="bb-cat-dig-preview">
    <div className="bb-cat-dig-preview-bar"><b>Prévia da página</b><span className="help">Ilustrativa. Confira o site após publicar.</span></div>
    <div className="bb-cat-dig-site">
      <div className="bb-cat-dig-crumb">Início / <b>{cat.titulo || 'Catálogo digital'}</b></div>
      <div className="bb-cat-dig-ttl"><h4>{cat.titulo || 'Catálogo digital'}</h4>{cat.intro ? <p>{cat.intro}</p> : null}</div>
      <div className="bb-cat-dig-flip">
        <span className="bb-cat-dig-flip-ic" aria-hidden="true">❏</span>
        <b>Flipbook</b>
        <span className="bb-cat-dig-flip-url">{cat.flipbookUrl?.trim() || 'URL do flipbook não definida'}</span>
      </div>
      {itens.length ? <div className="bb-cat-dig-cards">{itens.map((it, i) => <div className="bb-cat-dig-pr" key={i}>
        <small>❏ Flipbook</small>
        <b>{it.nome}</b>
        <div className="bb-cat-dig-pr-foot"><span className="bb-cat-dig-folhear">Folhear</span>{it.url?.trim() ? <span className="bb-cat-dig-link">link próprio</span> : null}</div>
      </div>)}</div> : null}
    </div>
  </div>
}
