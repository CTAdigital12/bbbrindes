'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { MediaPicker } from './MediaPicker'
import { photo, type ProductColor, type Variacao } from './model'
import type { FieldProps } from './ProductFields'
import { PaletaCores, type CorMarcada } from '../../components/produto/PaletaCores'
// Hex valido = #rrggbb. Vazio/nulo e legitimo: o site resolve o tom pelo nome da
// cor (HEX_PADRAO em frontend/src/lib/produtos.ts), entao nao forcamos tonalidade.
const isHex = (hex?: string | null) => /^#[0-9a-f]{6}$/i.test(hex || '')
// Nome travado quando a cor veio da paleta (tem codigo e nao e a "cor especial" 99).
// A especial (99) e as linhas legado sem codigo seguem editaveis (nome a mao).
const nomeTravado = (color: ProductColor) => Boolean(color.codigo) && String(color.codigo) !== '99'

// Lista de cores de um bloco (item 5): paleta mestra da BB + uma linha por cor marcada
// (tom, nome, foto). Reaproveitada nos dois blocos: o base grava no array `cores`, o
// acessorio em `variacao.coresAcessorio`. `idPrefix` separa os ids dos campos de nome
// entre os blocos; so o base casa com o errorField da validacao (bb-cor-nome-*), porque
// a validacao (product-validation.ts) so cobra o nome das cores do `cores`.
function ColorList({ colors, onChange, disabled, errorField, idPrefix }: {
  colors: ProductColor[]
  onChange: (next: CorMarcada[]) => void
  disabled?: boolean
  errorField?: string
  idPrefix: string
}) {
  const [selected, setSelected] = useState<number>()
  function update(index: number, patch: Partial<ProductColor>) { onChange(colors.map((color, i) => i === index ? { ...color, ...patch } : color)) }
  return <>
    {/* Paleta mestra da BB. Marcar uma cor aqui cria a linha dela abaixo. */}
    <PaletaCores value={colors} onChange={onChange} disabled={disabled} />
    {colors.length === 0
      ? <p className="sub">Marque as cores na paleta acima. Cada cor marcada vira uma linha aqui embaixo, onde você associa a foto dela.</p>
      : <p className="sub">Uma linha por cor marcada na paleta. Associe a foto de cada uma. A tonalidade (bolinha) é opcional: em automático, o site escolhe o tom pelo nome. Só a cor especial é nomeada à mão.</p>}
    {colors.map((color, index) => {
      const travado = nomeTravado(color)
      const nomeId = `${idPrefix}-${index}`
      return <div className="cor bb-color-row" key={color.id ?? index}>
        <div className="bb-swatch-cell">
          <input className="bb-swatch-input" type="color" aria-label={`Tonalidade da cor ${index + 1}`} value={isHex(color.hex) ? color.hex! : '#cbd5e1'} onChange={e => update(index, { hex: e.target.value })} disabled={disabled} />
          {isHex(color.hex)
            ? <button type="button" className="bb-swatch-note bb-swatch-clear" disabled={disabled} aria-label={`Usar tom automático na cor ${index + 1}`} onClick={() => update(index, { hex: null })}>limpar</button>
            : <span className="bb-swatch-note">automático</span>}
        </div>
        {travado
          ? <input className="inp" aria-label={`Cor ${index + 1}`} value={`${color.codigo} · ${color.nome}`} disabled readOnly />
          : <input id={nomeId} className="inp" aria-label={`Nome da cor ${index + 1}`} aria-required="true" aria-invalid={errorField === nomeId} aria-describedby={errorField === nomeId ? 'bb-product-error' : undefined} placeholder="Nome da cor especial (obrigatório)" value={color.nome} onChange={e => update(index, { nome: e.target.value })} disabled={disabled} />}
        <div className="cf">{photo(color.imagem)?.url ? <><img src={photo(color.imagem)!.url!} alt={color.nome} /><button type="button" className="lnk" onClick={() => setSelected(index)} disabled={disabled}>Trocar</button><button type="button" className="lnk red" disabled={disabled} onClick={() => update(index, { imagem: null })}>Remover foto</button></> : <><button type="button" className="emp" aria-label={`Adicionar foto da cor ${index + 1}`} onClick={() => setSelected(index)} disabled={disabled}>+</button><span className="bb-warning">Falta a foto</span></>}</div>
        <button type="button" className="btn danger sm" aria-label={`Remover cor ${index + 1} (desmarca na paleta)`} disabled={disabled} onClick={() => onChange(colors.filter((_, i) => i !== index))}>×</button>
      </div>
    })}
    {selected !== undefined ? <MediaPicker onClose={() => setSelected(undefined)} onSelect={images => update(selected, { imagem: images[0] })} /> : null}
  </>
}

// Item 5 (cores base x acessorio): a aba Cores vira DOIS blocos. O base grava no array
// `cores` (como antes); o acessorio em `variacao.coresAcessorio`. Cada bloco tem um
// rotulo editavel (ex. "Garrafa"/"Tampa") e o toggle "Nao preencher" (ligado = o produto
// nao tem cor naquela metade, esconde o seletor e a lista do bloco). Defaults de produto
// legado (variacao indefinida): base preenche, acessorio nao preenche.
export function ProductColors({ product, change, disabled, errorField }: FieldProps) {
  const variacao: Variacao = product.variacao ?? {}
  const baseNaoPreencher = variacao.baseNaoPreencher ?? false
  const acessorioNaoPreencher = variacao.acessorioNaoPreencher ?? true
  return <div className="bb-color-blocks">
    <section className="bb-color-block">
      <h3>Cor base</h3>
      <div className="fld">
        <label htmlFor="bb-variacao-baseRotulo">Nome da parte (opcional)</label>
        <input className="inp" id="bb-variacao-baseRotulo" placeholder="Garrafa" value={variacao.baseRotulo ?? ''} onChange={e => change('variacao.baseRotulo', e.target.value)} disabled={disabled} />
        <span className="help">Como esta parte aparece para o cliente. Deixe em branco se o produto tem cor única.</span>
      </div>
      <label className="bb-check"><input type="checkbox" checked={baseNaoPreencher} disabled={disabled} onChange={e => change('variacao.baseNaoPreencher', e.target.checked)} />Não preencher as cores da base</label>
      {baseNaoPreencher
        ? <p className="sub">Este produto não tem cor de base. Desmarque acima para escolher as cores.</p>
        : <ColorList colors={product.cores ?? []} onChange={next => change('cores', next)} disabled={disabled} errorField={errorField} idPrefix="bb-cor-nome" />}
    </section>
    <section className="bb-color-block">
      <h3>Cor do acessório</h3>
      <div className="fld">
        <label htmlFor="bb-variacao-acessorioRotulo">Nome da parte (opcional)</label>
        <input className="inp" id="bb-variacao-acessorioRotulo" placeholder="Tampa" value={variacao.acessorioRotulo ?? ''} onChange={e => change('variacao.acessorioRotulo', e.target.value)} disabled={disabled} />
        <span className="help">Use quando o produto tem uma segunda parte com cor própria (ex. a tampa).</span>
      </div>
      <label className="bb-check"><input type="checkbox" checked={acessorioNaoPreencher} disabled={disabled} onChange={e => change('variacao.acessorioNaoPreencher', e.target.checked)} />Não preencher as cores do acessório</label>
      {acessorioNaoPreencher
        ? <p className="sub">Este produto não tem cor de acessório. Desmarque acima para escolher as cores.</p>
        : <ColorList colors={variacao.coresAcessorio ?? []} onChange={next => change('variacao.coresAcessorio', next)} disabled={disabled} errorField={errorField} idPrefix="bb-coracess-nome" />}
    </section>
  </div>
}
