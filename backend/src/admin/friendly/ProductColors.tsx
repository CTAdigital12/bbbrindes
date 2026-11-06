'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { MediaPicker } from './MediaPicker'
import { photo, type ProductColor } from './model'
import type { FieldProps } from './ProductFields'
export function ProductColors({ product, change, disabled }: FieldProps) {
  const [selected, setSelected] = useState<number>()
  const colors = product.cores ?? []
  function update(index: number, patch: Partial<ProductColor>) { change('cores', colors.map((color, i) => i === index ? { ...color, ...patch } : color)) }
  return <><p className="sub">Associe uma foto à cor correspondente do produto.</p>{colors.map((color, index) => <div className="cor bb-color-row" key={color.id ?? index}>
    <input className="bb-swatch-input" type="color" aria-label={`Tonalidade da cor ${index + 1}`} value={/^#[0-9a-f]{6}$/i.test(color.hex || '') ? color.hex! : '#cbd5e1'} onChange={e => update(index, { hex: e.target.value })} disabled={disabled} />
    <input className="inp" aria-label={`Nome da cor ${index + 1}`} value={color.nome} onChange={e => update(index, { nome: e.target.value })} disabled={disabled} />
    <div className="cf">{photo(color.imagem)?.url ? <><img src={photo(color.imagem)!.url!} alt={color.nome} /><button type="button" className="lnk" onClick={() => setSelected(index)} disabled={disabled}>Trocar</button><button type="button" className="lnk red" disabled={disabled} onClick={() => update(index, { imagem: null })}>Remover foto</button></> : <><button type="button" className="emp" aria-label={`Adicionar foto da cor ${index + 1}`} onClick={() => setSelected(index)} disabled={disabled}>+</button><span className="bb-warning">Falta a foto</span></>}</div>
    <button type="button" className="btn danger sm" aria-label={`Remover cor ${index + 1}`} disabled={disabled} onClick={() => change('cores', colors.filter((_, i) => i !== index))}>×</button>
  </div>)}<button type="button" className="btn sm" disabled={disabled} onClick={() => change('cores', [...colors, { nome: '', hex: '#cbd5e1' }])}>+ Adicionar cor</button>
    {selected !== undefined ? <MediaPicker onClose={() => setSelected(undefined)} onSelect={images => update(selected, { imagem: images[0] })} /> : null}
  </>
}
