"use client"
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import type { LogoDraft } from './logo-model'
// Previa fiel ao marquee de marcas da home (.logos): a faixa com o rotulo e a tira
// de logos. O logo em edicao aparece em destaque entre dois espacos de exemplo.
export function LogoPreview({ logo, imagem }: { logo: LogoDraft; imagem?: string | null }) {
  const src = imagem || logo.url || null
  const nome = logo.nome.trim() || 'Nome da marca'
  return <div className="bb-logo-preview">
    <div className="bb-logo-preview-bar"><b>Prévia</b><span className="help">Ilustrativa. Confira o site após publicar.</span></div>
    <div className="bb-logo-mq">
      <span className="bb-logo-mq-lab">Marcas que já escolheram a <b>BB Brindes</b></span>
      <div className="bb-logo-mq-strip">
        <span className="bb-logo-mq-item ghost" aria-hidden>Marca</span>
        {src ? <span className="bb-logo-mq-item on"><img src={src} alt={nome} /></span> : <span className="bb-logo-mq-item vazio">{nome}</span>}
        <span className="bb-logo-mq-item ghost" aria-hidden>Marca</span>
      </div>
    </div>
    <div className="bb-logo-meta"><span className="bb-logo-nome">{nome}</span><span className="bb-logo-ordem">Ordem: {logo.ordem ?? 0}</span></div>
  </div>
}
