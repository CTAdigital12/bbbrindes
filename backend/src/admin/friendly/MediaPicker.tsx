'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { requestJSON, uploadImage } from './api'
import { useDialog } from './useDialog'
import type { Media } from './model'
export function MediaPicker({ multiple = false, onSelect, onClose }: { multiple?: boolean; onSelect: (media: Media[]) => void; onClose: () => void }) {
  const [images, setImages] = useState<Media[]>([])
  const [selected, setSelected] = useState<Media[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    const query = new URLSearchParams({ limit: '36', page: String(page), depth: '0', sort: '-createdAt', 'where[mimeType][contains]': 'image' })
    if (search) query.set('where[filename][contains]', search)
    requestJSON<{ docs: Media[]; totalPages: number }>(`/api/media?${query}`, { signal: controller.signal })
      .then(result => { setImages(result.docs); setPages(result.totalPages) }).catch(cause => { if (cause.name !== 'AbortError') setError(cause.message) }).finally(() => setLoading(false))
    return () => controller.abort()
  }, [search, page])
  const dialog = useDialog(onClose, '#bb-media-search')
  function choose(image: Media) {
    setSelected(previous => previous.some(m => m.id === image.id) ? previous.filter(m => m.id !== image.id) : multiple ? [...previous, image] : [image])
  }
  async function upload(files: FileList | null) {
    if (!files?.length) return
    setLoading(true); setError('')
    try {
      const uploaded: Media[] = []
      for (const file of Array.from(files)) uploaded.push(await uploadImage(file))
      setImages(previous => [...uploaded, ...previous]); setSelected(previous => multiple ? [...previous, ...uploaded] : [uploaded[0]])
    } catch (cause) { setError((cause as Error).message) } finally { setLoading(false) }
  }
  return <div className="ov" onClick={e => { if (e.target === e.currentTarget) onClose() }}><div ref={dialog} className="modal bb-media-modal" role="dialog" aria-modal="true" aria-labelledby="bb-picker-title">
    <div className="mh"><h2 id="bb-picker-title">Escolher da biblioteca</h2><span className="sp" /><button type="button" className="x-btn" aria-label="Fechar biblioteca" onClick={onClose}>×</button></div>
    <div className="toolbar bb-picker-toolbar"><label className="btn">Enviar imagens<input type="file" hidden accept="image/*" multiple={multiple} onChange={e => void upload(e.target.files)} /></label><span className="sp" /><input aria-label="Buscar imagem na biblioteca" id="bb-media-search" className="inp search" type="search" placeholder="Buscar imagem…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} /></div>
    <div className="bb-picker-content">{error ? <p role="alert" className="bb-error">{error}</p> : null}{loading ? <p role="status">Carregando imagens…</p> : null}<div className="mgrid">{images.map(image => <button type="button" className={`mi ${selected.some(m => m.id === image.id) ? 'sel' : ''}`} key={image.id} aria-pressed={selected.some(m => m.id === image.id)} aria-label={image.alt || image.filename || 'Imagem'} onClick={() => choose(image)}>
      <img src={image.url || ''} alt="" loading="lazy" /><span className="nm">{image.filename}</span>
    </button>)}</div></div>
    <div className="mf"><button type="button" className="btn sm ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button><span>{page} de {Math.max(1, pages)}</span><button type="button" className="btn sm ghost" disabled={page >= pages} onClick={() => setPage(page + 1)}>Próxima</button><span className="sp" /><span>{selected.length} selecionada(s)</span><button type="button" className="btn pri" disabled={!selected.length || loading} onClick={() => { onSelect(selected); onClose() }}>Usar imagem{selected.length > 1 ? 's' : ''}</button></div>
  </div></div>
}
