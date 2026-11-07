"use client"
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { photo } from '../friendly/model'
import { plainText } from '../friendly/product-data'
import { produtoIDs } from './campanha-data'
import type { CampanhaDraft } from './campanha-model'
// Previa fiel: o card da campanha (igual ao grid "Campanhas e datas" da home) e um
// resumo da pagina da campanha (chamada, texto e quantos produtos em destaque).
export function CampanhaPreview({ campanha }: { campanha: CampanhaDraft }) {
  const img = photo(campanha.imagem)?.url
  const texto = plainText(campanha.conteudo)
  return <div className="bb-camp-preview">
    <div className="bb-camp-preview-bar"><b>Prévia</b><span className="help">Ilustrativa. Confira o site após publicar.</span></div>
    <div className="bb-camp-tile" style={img ? undefined : { background: '#004431' }}>
      {img ? <img src={img} alt="" /> : null}
      {campanha.mes ? <span className="bb-camp-mes">{campanha.mes}</span> : null}
      <span className="bb-camp-nome">{campanha.nome || 'Nome da campanha'}</span>
    </div>
    <div className="bb-camp-landing">
      <span className="bb-camp-sec">Página da campanha</span>
      {campanha.chamada ? <p className="bb-camp-chamada">{campanha.chamada}</p> : null}
      {texto ? <p className="bb-camp-texto">{texto}</p> : <p className="bb-camp-texto bb-camp-empty">Sem texto da página ainda.</p>}
      <span className="bb-camp-prod">{produtoIDs(campanha).length} produto(s) em destaque</span>
    </div>
  </div>
}
