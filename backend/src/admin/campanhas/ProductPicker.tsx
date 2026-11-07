'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { requestJSON } from '../friendly/api'
import { useDialog } from '../friendly/useDialog'
import { photo, type Product } from '../friendly/model'
// Seletor de produtos da campanha: busca em /api/produtos (paginado) e devolve a
// selecao completa (objetos com id/nome) para o editor. Padrao do MediaPicker.
export function ProductPicker({ initial, onApply, onClose }: { initial: Product[]; onApply: (produtos: Product[]) => void; onClose: () => void }) {
  const [docs, setDocs] = useState<Product[]>([])
  const [selected, setSelected] = useState<Product[]>(initial)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    const query = new URLSearchParams({ limit: '24', page: String(page), depth: '1', sort: 'nome' })
    if (search) query.set('where[nome][contains]', search)
    requestJSON<{ docs: Product[]; totalPages: number }>(`/api/produtos?${query}`, { signal: controller.signal })
      .then(result => { setDocs(result.docs); setPages(result.totalPages) })
      .catch(cause => { if ((cause as Error).name !== 'AbortError') setError((cause as Error).message) })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [search, page])
  const dialog = useDialog(onClose, '#bb-prod-search')
  const isOn = (p: Product) => selected.some(s => s.id === p.id)
  function toggle(p: Product) { setSelected(prev => isOn(p) ? prev.filter(s => s.id !== p.id) : [...prev, { id: p.id, nome: p.nome, codigoSite: p.codigoSite } as Product]) }
  return <div className="ov" onClick={e => { if (e.target === e.currentTarget) onClose() }}><div ref={dialog} className="modal bb-media-modal" role="dialog" aria-modal="true" aria-labelledby="bb-prod-title">
    <div className="mh"><h2 id="bb-prod-title">Produtos da campanha</h2><span className="sp" /><button type="button" className="x-btn" aria-label="Fechar seleção de produtos" onClick={onClose}>×</button></div>
    <div className="toolbar bb-picker-toolbar"><span className="bb-prod-count">{selected.length} selecionado(s)</span><span className="sp" /><input id="bb-prod-search" className="inp search" type="search" aria-label="Buscar produto" placeholder="Buscar produto…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} /></div>
    <div className="bb-picker-content">{error ? <p role="alert" className="bb-error">{error}</p> : null}{loading ? <p role="status">Carregando produtos…</p> : null}<div className="bb-prod-grid">{docs.map(p => <button type="button" key={p.id} className={`bb-prod-item ${isOn(p) ? 'sel' : ''}`} aria-pressed={isOn(p)} onClick={() => toggle(p)}>
      {photo(p.imagens?.[0])?.url ? <img src={photo(p.imagens?.[0])!.url!} alt="" loading="lazy" /> : <span className="bb-prod-noimg">Sem foto</span>}
      <span className="bb-prod-nm">{p.nome}</span><span className="bb-prod-cod">{p.codigoSite}</span>
    </button>)}</div></div>
    <div className="mf"><button type="button" className="btn sm ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button><span>{page} de {Math.max(1, pages)}</span><button type="button" className="btn sm ghost" disabled={page >= pages} onClick={() => setPage(page + 1)}>Próxima</button><span className="sp" /><button type="button" className="btn pri" onClick={() => { onApply(selected); onClose() }}>Usar {selected.length} produto(s)</button></div>
  </div></div>
}
