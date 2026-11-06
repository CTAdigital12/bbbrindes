'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { requestJSON } from './api'
import { Icon } from './icons'
import { ProductFields, PRODUCT_TABS } from './ProductFields'
import { ProductPreview } from './ProductPreview'
import { categoryIDs, photo, type Category, type Product } from './model'
import { ProductAddress } from './ProductAddress'
import { ProductPublication } from './ProductPublication'
import { productBody, setProductField, validateProduct } from './product-data'

const SEALS = [ ['livreDeBpa', 'Livre de BPA'], ['usoMicroondas', 'Uso em micro-ondas'], ['usoLavaLoucas', 'Uso em lava-louças'], ['recicladoTotal', '100% reciclado'], ['logisticaReversa', 'Logística reversa'], ['usoPermanente', 'Uso permanente'], ['reducaoCo2', 'Redução de CO2'], ['fonteRenovavel', 'Fonte renovável'], ['designCircular', 'Design circular'], ['upcycling', 'Upcycling'], ['fibraNatural', 'Fibra natural'], ['reciclavel', 'Reciclável'], ['reducaoPlastico', 'Redução de plástico'] ]
export function ProductEditor({ initial, categories, canSave = true }: { initial: Product; categories: Category[]; canSave?: boolean }) {
  const router = useRouter()
  const defaults = { ...initial, quantidadeMinima: initial.quantidadeMinima ?? 500 }
  const [original, setOriginal] = useState<Product>(defaults)
  const [product, setProduct] = useState<Product>(defaults)
  const [tab, setTab] = useState('geral')
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const dirty = JSON.stringify(product) !== JSON.stringify(original)
  const disabled = !canSave || saving
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  function change(field: string, value: unknown) { setProduct(current => setProductField(current, field, value)); setMessage('') }
  function toggleCategory(id: number, checked: boolean) {
    const ids = categoryIDs(product)
    if (checked && ids.length >= 3) { setError('Selecione no máximo três categorias.'); return }
    change('categorias', checked ? [...(product.categorias ?? []), categories.find(c => c.id === id)!] : (product.categorias ?? []).filter(c => (typeof c === 'number' ? c : c.id) !== id))
  }
  async function save(visible: boolean) {
    const validation = validateProduct(product)
    if (validation) { setError(validation); return }
    setSaving(true); setError(''); setMessage('')
    const next = { ...product, canais: { ...product.canais, site: visible } }
    try {
      const body = productBody(next, original.id ? original : undefined)
      if (!Object.keys(body).length) { setMessage('Nenhuma alteração para salvar.'); return }
      const result = await requestJSON<{ doc: Product }>(`/api/produtos${original.id ? `/${original.id}` : ''}?depth=1`, { method: original.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const saved = { ...result.doc, quantidadeMinima: result.doc.quantidadeMinima ?? 500 }
      setProduct(saved); setOriginal(saved); setMessage('Produto salvo. O site pode levar alguns minutos para exibir as alterações.')
      if (!original.id) router.push(`/admin/collections/produtos/${result.doc.id}`)
    } catch (cause) { setError((cause as Error).message) } finally { setSaving(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>{original.id ? 'Editar produto' : 'Adicionar produto'}</h1>{original.id ? <Link className="btn" href="/admin/collections/produtos/create"><Icon name="plus" />Adicionar produto</Link> : null}<span className="sp" /><Link className="lnk" href="/admin/collections/produtos">Voltar para Produtos</Link></div>
    {error ? <p className="bb-error" role="alert">{error}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="edit"><div>
      <input className="ttl" aria-label="Nome do produto" placeholder="Nome do produto" value={product.nome} disabled={disabled} onChange={e => change('nome', e.target.value)} />
      <ProductAddress product={product} />
      <div className="bb-card"><div className="bd bb-editor-body"><div className="tabs" role="tablist" aria-label="Informações do produto">{PRODUCT_TABS.map(([key, label]) => <button type="button" role="tab" id={`bb-tab-${key}`} aria-controls="bb-tab-panel" aria-selected={tab === key} className={tab === key ? 'on' : ''} key={key} onClick={() => setTab(key)}>{label}</button>)}</div><div id="bb-tab-panel" role="tabpanel" aria-labelledby={`bb-tab-${tab}`}><ProductFields product={product} change={change} tab={tab} disabled={disabled} /></div></div></div>
    </div><aside className="rail">
      <ProductPublication product={product} original={original} dirty={dirty} disabled={disabled} saving={saving} onSave={visible => void save(visible)} onPreview={() => setPreview(true)} />
      <div className="bb-card"><div className="hd">Categorias</div><div className="bd"><div className="checks">{categories.map(category => <label key={category.id}><input type="checkbox" disabled={disabled} checked={categoryIDs(product).includes(category.id)} onChange={e => toggleCategory(category.id, e.target.checked)} />{photo(category.icone)?.url ? <img src={photo(category.icone)!.url!} alt="" /> : null}{category.nome}</label>)}</div><span className="help">Até três categorias. A primeira é a principal.</span></div></div>
      <div className="bb-card"><div className="hd">Selos do produto</div><div className="bd"><div className="checks">{SEALS.map(([key, label]) => <label key={key}><input type="checkbox" checked={Boolean(product.selos?.[key])} disabled={disabled} onChange={e => change(`selos.${key}`, e.target.checked)} />{label}</label>)}</div></div></div>
    </aside></div>{preview ? <ProductPreview product={product} onClose={() => setPreview(false)} /> : null}
  </section></div>
}
