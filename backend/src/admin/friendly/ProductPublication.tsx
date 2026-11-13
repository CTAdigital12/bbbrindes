"use client"
import React from 'react'
import Link from 'next/link'
import { Icon } from './icons'
import { dateLabel, published, type Product } from './model'
type Props = { product: Product; original: Product; dirty: boolean; disabled: boolean; saving: boolean; onSave: (visible: boolean) => void; onPreview: () => void }
// Acao principal em 2 passos, pra ninguem publicar sem querer:
// - produto novo (ainda sem id): o botao SALVA (rascunho).
// - ja salvo e nao publicado: o botao vira PUBLICAR.
// - ja publicado: o botao vira ATUALIZAR (salva mantendo publicado).
// visible=false grava canais.site=false (rascunho); visible=true publica.
function acaoPrincipal(product: Product, original: Product, saving: boolean): { label: string; visible: boolean } {
  if (saving) return { label: 'Salvando…', visible: false }
  if (!original.id) return { label: 'Salvar', visible: false }
  if (!published(product)) return { label: 'Publicar', visible: true }
  return { label: 'Atualizar', visible: true }
}
export function ProductPublication({ product, original, dirty, disabled, saving, onSave, onPreview }: Props) {
  const novo = !original.id
  const act = acaoPrincipal(product, original, saving)
  return <div className="bb-card pub"><div className="hd">Publicar</div><div className="bd">
    <div className="bb-flex">{novo ? null : <><button type="button" className="btn sm ghost" disabled={disabled} onClick={() => onSave(false)}>{published(product) ? 'Despublicar' : 'Salvar sem publicar'}</button><span className="sp" /></>}<button type="button" className="btn sm ghost" onClick={onPreview}><Icon name="eye" />Visualizar</button></div>
    <div className="line">Status: <b>{published(product) ? 'Publicado' : 'Não publicado'}</b></div>
    <div className="line">Última alteração: <b>{dateLabel(product.updatedAt)}</b></div>
    {dirty ? <span className="bb-warning">Alterações ainda não salvas</span> : null}
    {novo ? <span className="help">Salve o produto primeiro. Depois de salvo, este botão vira Publicar.</span> : null}
    </div><div className="foot"><Link className="lnk" href="/admin/collections/produtos">Cancelar</Link><button type="button" className="btn pri" disabled={disabled} onClick={() => onSave(act.visible)}>{act.label}</button></div>
  </div>
}
