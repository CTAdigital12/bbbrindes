'use client'
import React, { useEffect, useState } from 'react'
import { requestJSON } from './api'
import { useDialog } from './useDialog'
// Seletor de tags compartilhado por cases, blog e imprensa: busca em /api/tags
// (paginado) e devolve a selecao (objetos com id/nome) para o editor. Padrao do
// ProductPicker. Aqui so se MARCA/DESMARCA tag existente; criar tag nova fica na
// tela Tags.
export type TagOption = { id: number; nome: string; slug?: string }
export function TagPicker({ initial, onApply, onClose }: { initial: TagOption[]; onApply: (tags: TagOption[]) => void; onClose: () => void }) {
  const [docs, setDocs] = useState<TagOption[]>([])
  const [selected, setSelected] = useState<TagOption[]>(initial)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    const query = new URLSearchParams({ limit: '24', page: String(page), depth: '0', sort: 'nome' })
    if (search) query.set('where[nome][contains]', search)
    requestJSON<{ docs: TagOption[]; totalPages: number }>(`/api/tags?${query}`, { signal: controller.signal })
      .then(result => { setDocs(result.docs); setPages(result.totalPages) })
      .catch(cause => { if ((cause as Error).name !== 'AbortError') setError((cause as Error).message) })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [search, page])
  const dialog = useDialog(onClose, '#bb-tag-search')
  const isOn = (t: TagOption) => selected.some(s => s.id === t.id)
  function toggle(t: TagOption) { setSelected(prev => isOn(t) ? prev.filter(s => s.id !== t.id) : [...prev, { id: t.id, nome: t.nome, slug: t.slug }]) }
  return <div className="ov" onClick={e => { if (e.target === e.currentTarget) onClose() }}><div ref={dialog} className="modal bb-media-modal" role="dialog" aria-modal="true" aria-labelledby="bb-tag-title">
    <div className="mh"><h2 id="bb-tag-title">Tags do conteúdo</h2><span className="sp" /><button type="button" className="x-btn" aria-label="Fechar seleção de tags" onClick={onClose}>×</button></div>
    <div className="toolbar bb-picker-toolbar"><span className="bb-prod-count">{selected.length} selecionada(s)</span><span className="sp" /><input id="bb-tag-search" className="inp search" type="search" aria-label="Buscar tag" placeholder="Buscar tag…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} /></div>
    <div className="bb-picker-content">{error ? <p role="alert" className="bb-error">{error}</p> : null}{loading ? <p role="status">Carregando tags…</p> : null}{!loading && !docs.length ? <p role="status" className="help">Nenhuma tag encontrada. Crie tags no menu Tags.</p> : null}<div className="bb-tag-grid">{docs.map(t => <button type="button" key={t.id} className={`bb-tag-opt ${isOn(t) ? 'sel' : ''}`} aria-pressed={isOn(t)} onClick={() => toggle(t)}>{t.nome}</button>)}</div></div>
    <div className="mf"><button type="button" className="btn sm ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button><span>{page} de {Math.max(1, pages)}</span><button type="button" className="btn sm ghost" disabled={page >= pages} onClick={() => setPage(page + 1)}>Próxima</button><span className="sp" /><button type="button" className="btn pri" onClick={() => { onApply(selected); onClose() }}>Usar {selected.length} tag(s)</button></div>
  </div></div>
}
