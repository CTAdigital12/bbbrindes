"use client"
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { photo, type Product } from '../friendly/model'
import { plainText } from '../friendly/product-data'
import { produtoIDs } from './campanha-data'
import { CAMPANHA_IMG_DIM, type CampanhaDraft } from './campanha-model'
// Previa fiel E completa (item F): mostra (1) o card da campanha como ele sai na home
// (recorte do lado direito), (2) a imagem ENVIADA inteira, sem corte, com a dimensao
// recomendada, pra pessoa ver o que subiu, e (3) o resumo da pagina com a chamada, o
// texto e os produtos em destaque pelo nome (nao so a contagem).
function produtosSelecionados(campanha: CampanhaDraft): Product[] {
  return (campanha.produtos ?? []).filter((p): p is Product => typeof p === 'object' && p !== null)
}
export function CampanhaPreview({ campanha }: { campanha: CampanhaDraft }) {
  const imagem = photo(campanha.imagem)
  const img = imagem?.url
  const texto = plainText(campanha.conteudo)
  const produtos = produtosSelecionados(campanha)
  const total = produtoIDs(campanha).length
  return <div className="bb-camp-preview">
    <div className="bb-camp-preview-bar"><b>Prévia</b><span className="help">Ilustrativa. Confira o site após publicar.</span></div>
    <div className="bb-camp-tile" style={img ? undefined : { background: '#004431' }}>
      {img ? <img src={img} alt="" /> : null}
      {campanha.mes ? <span className="bb-camp-mes">{campanha.mes}</span> : null}
      <span className="bb-camp-nome">{campanha.nome || 'Nome da campanha'}</span>
    </div>
    <div style={{ marginTop: 12 }}>
      <span className="help" style={{ display: 'block', marginBottom: 4 }}>Imagem enviada (completa) · recomendado {CAMPANHA_IMG_DIM}</span>
      {img
        ? <img src={img} alt={imagem?.alt || 'Imagem da campanha'} style={{ display: 'block', width: '100%', borderRadius: 10, border: '1px solid rgba(0,0,0,.08)' }} />
        : <div style={{ display: 'grid', placeItems: 'center', height: 120, borderRadius: 10, border: '1px dashed rgba(0,0,0,.18)', color: 'var(--muted, #8a8a8a)', fontSize: 12.5, textAlign: 'center', padding: 12 }}>Sem imagem. Envie uma arte de {CAMPANHA_IMG_DIM} com o produto à direita.</div>}
    </div>
    <div className="bb-camp-landing">
      <span className="bb-camp-sec">Página da campanha</span>
      {campanha.chamada ? <p className="bb-camp-chamada">{campanha.chamada}</p> : null}
      {texto ? <p className="bb-camp-texto">{texto}</p> : <p className="bb-camp-texto bb-camp-empty">Sem texto da página ainda.</p>}
      <span className="bb-camp-prod">{total} produto(s) em destaque</span>
      {produtos.length ? <div className="bb-camp-chips" style={{ marginTop: 6 }}>{produtos.map(p => <span className="bb-camp-chip" key={p.id} style={{ paddingRight: 10 }}>{p.nome}</span>)}</div> : null}
    </div>
  </div>
}
