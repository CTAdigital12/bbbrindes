"use client"
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { photo } from '../friendly/model'
import { grupoLabel, type CategoriaDraft } from './categoria-model'
// Previa ilustrativa: o tile da categoria como na grade estilo iFood da home
// (icone redondo + nome) mais o grupo e quantos produtos usam a categoria.
export function CategoriaPreview({ categoria, produtosCount }: { categoria: CategoriaDraft; produtosCount?: number }) {
  const icone = photo(categoria.icone)?.url
  const nome = categoria.nome.trim() || 'Nome da categoria'
  const eco = categoria.grupo === 'ecologicos'
  return <div className="bb-cat-preview">
    <div className="bb-cat-preview-bar"><b>Prévia</b><span className="help">Ilustrativa. Confira o site após publicar.</span></div>
    <div className="bb-cat-tile">
      <span className="bb-cat-tile-ico">{icone ? <img src={icone} alt="" /> : <span className="letra" aria-hidden>{nome.charAt(0).toLocaleUpperCase('pt-BR')}</span>}</span>
      <span className="bb-cat-tile-nome">{nome}</span>
    </div>
    <div className="bb-cat-meta">
      <span className={`bb-cat-grp ${eco ? 'eco' : ''}`}>{grupoLabel(categoria.grupo)}</span>
      <span className="bb-cat-count">{produtosCount ?? 0} produto(s) na categoria</span>
    </div>
  </div>
}
