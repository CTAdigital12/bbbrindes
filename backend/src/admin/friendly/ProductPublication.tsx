"use client"
import React from 'react'
import Link from 'next/link'
import { Icon } from './icons'
import { dateLabel, published, type Product } from './model'
type Props = { product: Product; original: Product; dirty: boolean; disabled: boolean; saving: boolean; onSave: (visible: boolean) => void; onPreview: () => void }
function saveLabel(product: Product, original: Product, saving: boolean) {
  if (saving) return 'Salvando…'
  return original.id && published(product) ? 'Atualizar' : 'Publicar'
}
export function ProductPublication({ product, original, dirty, disabled, saving, onSave, onPreview }: Props) {
  return <div className="card pub"><div className="hd">Publicar</div><div className="bd">
    <div className="bb-flex"><button type="button" className="btn sm ghost" disabled={disabled} onClick={() => onSave(false)}>Salvar sem publicar</button><span className="sp" /><button type="button" className="btn sm ghost" onClick={onPreview}><Icon name="eye" />Visualizar</button></div>
    <div className="line">Status: <b>{published(product) ? 'Publicado' : 'Não publicado'}</b></div>
    <div className="line">Última alteração: <b>{dateLabel(product.updatedAt)}</b></div>
    {dirty ? <span className="bb-warning">Alterações ainda não salvas</span> : null}
    </div><div className="foot"><Link className="lnk" href="/admin/collections/produtos">Cancelar</Link><button type="button" className="btn pri" disabled={disabled} onClick={() => onSave(true)}>{saveLabel(product, original, saving)}</button></div>
  </div>
}
