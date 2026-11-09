'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { Icon } from './icons'
import { requestJSON } from './api'
import { categoryIDs, missingPhoto, photo, published, SITE_URL, type Product, type Category } from './model'

type Filter = 'todos' | 'publicado' | 'naopublicado' | 'semfoto'
const filters: { key: Filter; label: string; match: (product: Product) => boolean }[] = [
  { key: 'todos', label: 'Todos', match: () => true },
  { key: 'publicado', label: 'Publicados', match: published },
  { key: 'naopublicado', label: 'Não publicados', match: product => !published(product) },
  { key: 'semfoto', label: 'Sem foto', match: missingPhoto },
]
const normalized = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
export function ProductsList({ products: initial, categories, initialFilter = 'todos', canCreate = true, canUpdate = true, canDelete = true }: {
  products: Product[]; categories: Category[]; initialFilter?: string; canCreate?: boolean; canUpdate?: boolean; canDelete?: boolean;
}) {
  const [products, setProducts] = useState(initial)
  const [filter, setFilter] = useState(filters.some(f => f.key === initialFilter) ? initialFilter : 'todos')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [busy, setBusy] = useState<number>()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const matching = useMemo(() => products.filter(filters.find(f => f.key === filter)!.match)
    .filter(p => normalized(`${p.nome} ${p.codigoSite}`).includes(normalized(search)))
    .filter(p => !category || categoryIDs(p).includes(Number(category))), [products, filter, search, category])
  const pages = Math.max(1, Math.ceil(matching.length / limit))
  const current = Math.min(page, pages)
  const rows = matching.slice((current - 1) * limit, current * limit)
  const categoryNames = new Map(categories.map(c => [c.id, c.nome]))
  async function toggle(product: Product) {
    setBusy(product.id); setError('')
    try {
      const canais = { ...product.canais, site: !published(product) }
      await requestJSON(`/api/produtos/${product.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ canais }) })
      setProducts(previous => previous.map(p => p.id === product.id ? { ...p, canais } : p))
    } catch (cause) { setError((cause as Error).message) } finally { setBusy(undefined) }
  }
  async function remove(product: Product) {
    if (!window.confirm(`Excluir o produto "${product.nome}"? Esta ação não pode ser desfeita.`)) return
    setBusy(product.id); setError(''); setMessage('')
    try {
      await requestJSON(`/api/produtos/${product.id}`, { method: 'DELETE' })
      setProducts(previous => previous.filter(p => p.id !== product.id))
      setMessage('Produto excluído.')
    } catch (cause) { setError((cause as Error).message) } finally { setBusy(undefined) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Produtos</h1>{canCreate ? <Link className="btn" href="/admin/collections/produtos/create"><Icon name="plus" />Adicionar produto</Link> : null}</div>
    <div className="subsub">{filters.map((item, index) => <React.Fragment key={item.key}>{index ? <span className="sep">|</span> : null}<button type="button" className={item.key === filter ? 'on' : ''} onClick={() => { setFilter(item.key); setPage(1) }}>{item.label} <span className="n">({products.filter(item.match).length})</span></button></React.Fragment>)}</div>
    <div className="toolbar"><select className="sel bb-auto" aria-label="Filtrar por categoria" value={category} onChange={e => { setCategory(e.target.value); setPage(1) }}><option value="">Todas as categorias</option>{categories.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select><span className="sp" /><input className="inp search" type="search" placeholder="Buscar produtos…" aria-label="Buscar produtos" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} /></div>
    {error ? <p role="alert" className="bb-error">{error}</p> : null}{message ? <p role="status" className="bb-success">{message}</p> : null}
    <div className="bb-table-scroll"><table className="list"><thead><tr><th className="bb-photo-col" /><th>Nome</th><th>Código</th><th>Categorias</th><th>Mínimo</th><th>Status</th></tr></thead><tbody>
      {rows.map(product => <ProductRow key={product.id} product={product} categoryNames={categoryNames} busy={busy === product.id} canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} onToggle={() => void toggle(product)} onRemove={() => void remove(product)} />)}
      {!rows.length ? <tr><td colSpan={6} className="empty">Nenhum produto neste filtro.</td></tr> : null}
    </tbody></table></div>
    <div className="bb-pagination"><span>{matching.length ? (current - 1) * limit + 1 : 0}–{Math.min(current * limit, matching.length)} de {matching.length} produtos</span><span className="sp" /><label>Por página <select aria-label="Produtos por página" value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1) }}>{[10, 20, 50].map(n => <option key={n}>{n}</option>)}</select></label><button type="button" className="btn sm ghost" disabled={current === 1} onClick={() => setPage(current - 1)}>Anterior</button><span>{current} de {pages}</span><button type="button" className="btn sm ghost" disabled={current === pages} onClick={() => setPage(current + 1)}>Próxima</button></div>
  </section></div>
}

type RowProps = { product: Product; categoryNames: Map<number, string>; busy: boolean; canCreate: boolean; canUpdate: boolean; canDelete: boolean; onToggle: () => void; onRemove: () => void }
function ProductActions({ product, busy, canCreate, canUpdate, canDelete, onToggle, onRemove }: Omit<RowProps, 'categoryNames'>) {
  return <div className="ra"><Link className="lnk" href={`/admin/collections/produtos/${product.id}`}>Editar</Link>
    {canCreate ? <><span>|</span><Link className="lnk" href={`/admin/collections/produtos/create?copiar=${product.id}`}>Duplicar</Link></> : null}
    {canUpdate ? <><span>|</span><button type="button" className="lnk" disabled={busy} onClick={onToggle}>{published(product) ? 'Despublicar' : 'Publicar'}</button></> : null}
    {product.slug && published(product) ? <><span>|</span><a className="lnk" href={`${SITE_URL}/produto/${product.slug}/`} target="_blank" rel="noopener noreferrer">Ver no site</a></> : null}
    {canDelete ? <><span>|</span><button type="button" className="lnk red" disabled={busy} onClick={onRemove}>Excluir</button></> : null}
  </div>
}
function ProductRow(props: RowProps) {
  const { product, categoryNames, busy } = props
  const image = photo(product.imagens?.[0])
  return <tr aria-busy={busy}><td>{image?.url ? <img className="thumb" src={image.url} alt="" /> : <span className="nofoto">sem foto</span>}</td>
    <td className="t"><Link href={`/admin/collections/produtos/${product.id}`}>{product.nome}</Link><ProductActions {...props} /></td>
    <td>{product.codigoSite}</td><td>{categoryIDs(product).map(id => categoryNames.get(id)).filter(Boolean).join(', ')}</td><td>{product.quantidadeMinima ?? 500} un.</td>
    <td><span className={`st ${published(product) ? 'ok' : 'rasc'}`}>{published(product) ? 'Publicado' : 'Não publicado'}</span></td>
  </tr>
}
