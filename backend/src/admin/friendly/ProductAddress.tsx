"use client"
import React from 'react'
import { SITE_URL, published, type Product } from './model'
export function ProductAddress({ product }: { product: Product }) {
  if (!product.slug) return <div className="perma">Endereço: <span>Gerado automaticamente ao salvar</span></div>
  const url = `${SITE_URL}/produto/${encodeURIComponent(product.slug)}/`
  return <div className="perma">Endereço: {published(product) ? <a href={url} target="_blank" rel="noopener noreferrer"><code>{url}</code></a> : <code>{url}</code>}<span>{published(product) ? 'Gerado automaticamente' : 'Disponível após publicar'}</span></div>
}
