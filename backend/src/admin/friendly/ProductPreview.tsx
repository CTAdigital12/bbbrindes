'use client'
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { photo, type Product } from './model'
import { useDialog } from './useDialog'
import { plainText } from './product-data'
export function ProductPreview({ product, onClose }: { product: Product; onClose: () => void }) {
  const dialog = useDialog(onClose)
  return <div className="ov"><div ref={dialog} className="modal bb-product-preview" role="dialog" aria-modal="true" aria-labelledby="bb-preview-title">
    <div className="mh"><h2 id="bb-preview-title">Visualizar: {product.nome || 'Produto sem nome'}</h2><span className="pill-draft">Prévia das alterações</span><span className="sp" /><button type="button" className="x-btn" aria-label="Fechar prévia" onClick={onClose}>×</button></div>
    <div className="pv-prod"><div><div className="main">{photo(product.imagens?.[0])?.url ? <img src={photo(product.imagens?.[0])!.url!} alt={product.nome} /> : <span>Sem foto</span>}</div><div className="ths">{product.imagens?.map((image, index) => photo(image)?.url ? <img key={index} src={photo(image)!.url!} alt="" /> : null)}</div></div>
      <div><h3>{product.nome || 'Nome do produto'}</h3><p>{product.subtitulo}</p><p>{plainText(product.descricaoCompleta)}</p><b>Cores</b><div className="dots">{product.cores?.map((color, index) => <i key={index} style={{ background: color.hex || '#cbd5e1' }} title={color.nome} />)}</div><p>Pedido mínimo: <b>{product.quantidadeMinima ?? 500} unidades</b></p><span className="cta">Adicionar ao orçamento</span></div>
    </div>
  </div></div>
}
