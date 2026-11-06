"use client"
import React from 'react'
import type { FieldProps } from './ProductFields'
const HIGHLIGHTS = [['destaque', 'Destaque'], ['mais-vendido', 'Mais vendido'], ['lancamento', 'Lançamento']]
export function ProductPlacement({ product, change, disabled }: FieldProps) {
  function toggle(value: string, checked: boolean) {
    const selected = product.destaques ?? []
    change('destaques', checked ? [...selected, value] : selected.filter(item => item !== value))
  }
  return <details className="adv"><summary>Exibição no catálogo</summary>
    <div className="fld"><label htmlFor="bb-faixaPreco">Faixa de preço pública</label><select className="sel" id="bb-faixaPreco" value={product.faixaPreco ?? ''} disabled={disabled} onChange={e => change('faixaPreco', e.target.value || null)}>
      <option value="">Usar padrão do catálogo</option><option value="ate-3-99">Até R$ 3,99</option><option value="4-a-15">R$ 4 a R$ 15</option><option value="acima-de-15">Acima de R$ 15</option>
    </select></div>
    <div className="fld"><span className="lbl">Destaques</span><div className="checks">{HIGHLIGHTS.map(([value, label]) => <label key={value}><input type="checkbox" disabled={disabled} checked={(product.destaques ?? []).includes(value)} onChange={e => toggle(value, e.target.checked)} />{label}</label>)}</div></div>
  </details>
}
export function ProductChannels({ product, change, disabled }: FieldProps) {
  return <div className="fld"><span className="lbl">Outros canais</span><div className="checks">{[['tabelaRevenda', 'Tabela de revenda'], ['tabelaB2B', 'Tabela B2B']].map(([key, label]) => <label key={key}><input type="checkbox" disabled={disabled} checked={Boolean(product.canais?.[key as 'tabelaRevenda' | 'tabelaB2B'])} onChange={e => change(`canais.${key}`, e.target.checked)} />{label}</label>)}</div></div>
}
