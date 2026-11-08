'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { MediaPicker } from './MediaPicker'
import { photo, type ProductColor } from './model'
import type { FieldProps } from './ProductFields'
// Hex valido = #rrggbb. Vazio/nulo e legitimo: o site resolve o tom pelo nome da
// cor (HEX_PADRAO em frontend/src/lib/produtos.ts), entao nao forcamos tonalidade.
const isHex = (hex?: string | null) => /^#[0-9a-f]{6}$/i.test(hex || '')
export function ProductColors({ product, change, disabled, errorField }: FieldProps) {
  const [selected, setSelected] = useState<number>()
  const colors = product.cores ?? []
  function update(index: number, patch: Partial<ProductColor>) { change('cores', colors.map((color, i) => i === index ? { ...color, ...patch } : color)) }
  return <><p className="sub">Informe o nome de cada cor e associe a foto correspondente. A tonalidade (bolinha) é opcional: em automático, o site escolhe o tom pelo nome da cor.</p>{colors.map((color, index) => <div className="cor bb-color-row" key={color.id ?? index}>
    <div className="bb-swatch-cell">
      <input className="bb-swatch-input" type="color" aria-label={`Tonalidade da cor ${index + 1}`} value={isHex(color.hex) ? color.hex! : '#cbd5e1'} onChange={e => update(index, { hex: e.target.value })} disabled={disabled} />
      {isHex(color.hex)
        ? <button type="button" className="bb-swatch-note bb-swatch-clear" disabled={disabled} aria-label={`Usar tom automático na cor ${index + 1}`} onClick={() => update(index, { hex: null })}>limpar</button>
        : <span className="bb-swatch-note">automático</span>}
    </div>
    <input id={`bb-cor-nome-${index}`} className="inp" aria-label={`Nome da cor ${index + 1}`} aria-required="true" aria-invalid={errorField === `bb-cor-nome-${index}`} aria-describedby={errorField === `bb-cor-nome-${index}` ? 'bb-product-error' : undefined} placeholder="Nome da cor (obrigatório)" value={color.nome} onChange={e => update(index, { nome: e.target.value })} disabled={disabled} />
    <div className="cf">{photo(color.imagem)?.url ? <><img src={photo(color.imagem)!.url!} alt={color.nome} /><button type="button" className="lnk" onClick={() => setSelected(index)} disabled={disabled}>Trocar</button><button type="button" className="lnk red" disabled={disabled} onClick={() => update(index, { imagem: null })}>Remover foto</button></> : <><button type="button" className="emp" aria-label={`Adicionar foto da cor ${index + 1}`} onClick={() => setSelected(index)} disabled={disabled}>+</button><span className="bb-warning">Falta a foto</span></>}</div>
    <button type="button" className="btn danger sm" aria-label={`Remover cor ${index + 1}`} disabled={disabled} onClick={() => change('cores', colors.filter((_, i) => i !== index))}>×</button>
  </div>)}<button type="button" className="btn sm" disabled={disabled} onClick={() => change('cores', [...colors, { nome: '' }])}>+ Adicionar cor</button>
    {selected !== undefined ? <MediaPicker onClose={() => setSelected(undefined)} onSelect={images => update(selected, { imagem: images[0] })} /> : null}
  </>
}
