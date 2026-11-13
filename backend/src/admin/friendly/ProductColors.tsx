'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { MediaPicker } from './MediaPicker'
import { photo, type ProductColor } from './model'
import type { FieldProps } from './ProductFields'
import { PaletaCores } from '../../components/produto/PaletaCores'
// Hex valido = #rrggbb. Vazio/nulo e legitimo: o site resolve o tom pelo nome da
// cor (HEX_PADRAO em frontend/src/lib/produtos.ts), entao nao forcamos tonalidade.
const isHex = (hex?: string | null) => /^#[0-9a-f]{6}$/i.test(hex || '')
// Nome travado quando a cor veio da paleta (tem codigo e nao e a "cor especial" 99).
// A especial (99) e as linhas legado sem codigo seguem editaveis (nome a mao).
const nomeTravado = (color: ProductColor) => Boolean(color.codigo) && String(color.codigo) !== '99'
export function ProductColors({ product, change, disabled, errorField }: FieldProps) {
  const [selected, setSelected] = useState<number>()
  const colors = product.cores ?? []
  function update(index: number, patch: Partial<ProductColor>) { change('cores', colors.map((color, i) => i === index ? { ...color, ...patch } : color)) }
  return <>
    {/* Item A: paleta mestra da BB. Marcar uma cor aqui cria a linha dela abaixo. */}
    <PaletaCores value={colors} onChange={next => change('cores', next)} disabled={disabled} />
    {colors.length === 0
      ? <p className="sub">Marque as cores na paleta acima. Cada cor marcada vira uma linha aqui embaixo, onde você associa a foto dela.</p>
      : <p className="sub">Uma linha por cor marcada na paleta. Associe a foto de cada uma. A tonalidade (bolinha) é opcional: em automático, o site escolhe o tom pelo nome. Só a cor especial é nomeada à mão.</p>}
    {colors.map((color, index) => {
      const travado = nomeTravado(color)
      return <div className="cor bb-color-row" key={color.id ?? index}>
        <div className="bb-swatch-cell">
          <input className="bb-swatch-input" type="color" aria-label={`Tonalidade da cor ${index + 1}`} value={isHex(color.hex) ? color.hex! : '#cbd5e1'} onChange={e => update(index, { hex: e.target.value })} disabled={disabled} />
          {isHex(color.hex)
            ? <button type="button" className="bb-swatch-note bb-swatch-clear" disabled={disabled} aria-label={`Usar tom automático na cor ${index + 1}`} onClick={() => update(index, { hex: null })}>limpar</button>
            : <span className="bb-swatch-note">automático</span>}
        </div>
        {travado
          ? <input className="inp" aria-label={`Cor ${index + 1}`} value={`${color.codigo} · ${color.nome}`} disabled readOnly />
          : <input id={`bb-cor-nome-${index}`} className="inp" aria-label={`Nome da cor ${index + 1}`} aria-required="true" aria-invalid={errorField === `bb-cor-nome-${index}`} aria-describedby={errorField === `bb-cor-nome-${index}` ? 'bb-product-error' : undefined} placeholder="Nome da cor especial (obrigatório)" value={color.nome} onChange={e => update(index, { nome: e.target.value })} disabled={disabled} />}
        <div className="cf">{photo(color.imagem)?.url ? <><img src={photo(color.imagem)!.url!} alt={color.nome} /><button type="button" className="lnk" onClick={() => setSelected(index)} disabled={disabled}>Trocar</button><button type="button" className="lnk red" disabled={disabled} onClick={() => update(index, { imagem: null })}>Remover foto</button></> : <><button type="button" className="emp" aria-label={`Adicionar foto da cor ${index + 1}`} onClick={() => setSelected(index)} disabled={disabled}>+</button><span className="bb-warning">Falta a foto</span></>}</div>
        <button type="button" className="btn danger sm" aria-label={`Remover cor ${index + 1} (desmarca na paleta)`} disabled={disabled} onClick={() => change('cores', colors.filter((_, i) => i !== index))}>×</button>
      </div>
    })}
    {selected !== undefined ? <MediaPicker onClose={() => setSelected(undefined)} onSelect={images => update(selected, { imagem: images[0] })} /> : null}
  </>
}
