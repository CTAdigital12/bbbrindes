"use client"
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { requestJSON, uploadImage } from '../friendly/api'
import { semDescricao } from './midia-data'
import { MidiaAltEditor } from './MidiaAltEditor'
import type { Media } from '../friendly/model'
type MediaExtra = Media & { filesize?: number | null; width?: number | null; height?: number | null; mimeType?: string }
const PER_PAGE = 36
// Biblioteca de imagens: grade com busca, paginacao e envio. A edicao amigavel e a
// descricao (alt) de cada imagem, pelo modal. Busca as imagens pela API (como o
// MediaPicker), sem carregar tudo de uma vez.
export function MidiaList({ canUpdate = true }: { canUpdate?: boolean }) {
  const [images, setImages] = useState<MediaExtra[]>([])
  const [search, setSearch] = useState('')
  const [soSemAlt, setSoSemAlt] = useState(false)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [editing, setEditing] = useState<MediaExtra>()
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true); setError('')
    const query = new URLSearchParams({ limit: String(PER_PAGE), page: String(page), depth: '0', sort: '-createdAt', 'where[mimeType][contains]': 'image' })
    if (search) query.set('where[filename][contains]', search)
    requestJSON<{ docs: MediaExtra[]; totalPages: number; totalDocs: number }>(`/api/media?${query}`, { signal: controller.signal })
      .then(result => { setImages(result.docs); setPages(result.totalPages); setTotal(result.totalDocs) })
      .catch(cause => { if ((cause as Error).name !== 'AbortError') setError((cause as Error).message) })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [search, page])
  async function upload(files: FileList | null) {
    if (!files?.length) return
    setLoading(true); setError(''); setMessage('')
    try {
      const uploaded: MediaExtra[] = []
      for (const file of Array.from(files)) uploaded.push(await uploadImage(file) as MediaExtra)
      setImages(previous => [...uploaded, ...previous])
      setTotal(t => t + uploaded.length)
      setMessage(`${uploaded.length} imagem(ns) enviada(s). Lembre de escrever a descricao de cada uma.`)
    } catch (cause) { setError((cause as Error).message) } finally { setLoading(false) }
  }
  function onSaved(doc: Media) {
    setImages(previous => previous.map(m => m.id === doc.id ? { ...m, ...doc } : m))
    setEditing(undefined); setMessage('Descricao salva.')
  }
  const visible = soSemAlt ? images.filter(semDescricao) : images
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Mídia</h1><label className="btn"><span>Enviar imagens</span><input type="file" hidden accept="image/*" multiple disabled={loading} onChange={e => void upload(e.target.files)} /></label></div>
    <p className="sub">Biblioteca de imagens do site. Envie novas e escreva a descrição (alt) de cada uma, que ajuda o Google e os leitores de tela. {total ? <b>{total} imagens.</b> : null}</p>
    <div className="toolbar"><label className="bb-check"><input type="checkbox" checked={soSemAlt} onChange={e => setSoSemAlt(e.target.checked)} />Só sem descrição (nesta página)</label><span className="sp" /><input className="inp search" type="search" aria-label="Buscar imagem pelo nome do arquivo" placeholder="Buscar pelo nome do arquivo…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} /></div>
    {error ? <p className="bb-error" role="alert">{error}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}{loading ? <p role="status">Carregando imagens…</p> : null}
    <div className="bb-midia-grid">{visible.map(image => {
      const falta = semDescricao(image)
      return <button type="button" className={`bb-midia-card ${falta ? 'falta' : ''}`} key={image.id} onClick={() => setEditing(image)} aria-label={`Editar descrição de ${image.filename || 'imagem'}`}>
        <span className="bb-midia-thumb">{image.url ? <img src={image.url} alt="" loading="lazy" /> : <span className="nofoto">Sem imagem</span>}</span>
        <span className="bb-midia-nome">{image.filename}</span>
        {falta ? <span className="bb-midia-falta">Sem descrição</span> : <span className="bb-midia-alt" title={image.alt || ''}>{image.alt}</span>}
      </button>
    })}{!visible.length && !loading ? <p className="empty">{soSemAlt ? 'Todas as imagens desta página têm descrição.' : 'Nenhuma imagem encontrada.'}</p> : null}</div>
    <div className="bb-midia-pager"><button type="button" className="btn sm ghost" disabled={page <= 1 || loading} onClick={() => setPage(page - 1)}>Anterior</button><span>{page} de {Math.max(1, pages)}</span><button type="button" className="btn sm ghost" disabled={page >= pages || loading} onClick={() => setPage(page + 1)}>Próxima</button></div>
    {editing ? <MidiaAltEditor media={editing} canUpdate={canUpdate} onClose={() => setEditing(undefined)} onSaved={onSaved} /> : null}
  </section></div>
}
