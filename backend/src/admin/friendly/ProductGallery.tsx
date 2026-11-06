'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { uploadImage } from './api'
import { MediaPicker } from './MediaPicker'
import { mediaID, photo, type MediaRef } from './model'
export function ProductGallery({ images, onChange, disabled = false }: { images: MediaRef[]; onChange: (images: MediaRef[]) => void; disabled?: boolean }) {
  const [picker, setPicker] = useState(false)
  const [drag, setDrag] = useState<number>()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  function add(newImages: MediaRef[]) { onChange([...images, ...newImages.filter(image => !images.some(current => mediaID(current) === mediaID(image)))]) }
  async function upload(files: FileList | File[]) {
    setBusy(true); setError('')
    try { const uploaded: MediaRef[] = []; for (const file of Array.from(files)) uploaded.push(await uploadImage(file)); add(uploaded) }
    catch (cause) { setError((cause as Error).message) } finally { setBusy(false) }
  }
  function move(from: number, to: number) { const next = [...images]; next.splice(to, 0, next.splice(from, 1)[0]); onChange(next) }
  return <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); if (!disabled && e.dataTransfer.files.length) void upload(e.dataTransfer.files) }}>
    {error ? <p role="alert" className="bb-error">{error}</p> : null}
    {images.length ? <div className="gal">{images.map((image, index) => <div className="it" key={`${mediaID(image)}-${index}`} draggable={!disabled} onDragStart={() => setDrag(index)} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); e.stopPropagation(); if (drag !== undefined) { move(drag, index); setDrag(undefined) } }}>
      {photo(image)?.url ? <img src={photo(image)!.url!} alt={photo(image)?.alt || `Foto ${index + 1}`} /> : <span>Foto {index + 1}</span>}{index === 0 ? <span className="tg">Principal</span> : null}
      {!disabled ? <><button type="button" className="x" aria-label={`Remover foto ${index + 1}`} onClick={() => onChange(images.filter((_, i) => i !== index))}>×</button>{index > 0 ? <button type="button" className="bb-order" aria-label={`Mover foto ${index + 1} para antes`} onClick={() => move(index, index - 1)}>←</button> : null}</> : null}
    </div>)}{!disabled ? <button type="button" className="add" onClick={() => setPicker(true)}><span><b>+</b>Adicionar</span></button> : null}</div> : <div className="imgf"><span>Arraste as fotos do produto aqui</span><div className="row"><label className="btn sm pri">Enviar fotos<input type="file" hidden accept="image/*" multiple disabled={disabled || busy} onChange={e => { if (e.target.files) void upload(e.target.files) }} /></label><button type="button" className="btn sm ghost" disabled={disabled} onClick={() => setPicker(true)}>Escolher da biblioteca</button></div></div>}
    <p className="help">Imagens até 15 MB. A primeira foto é a principal. Arraste para mudar a ordem.</p>{busy ? <p role="status">Enviando imagens…</p> : null}
    {picker ? <MediaPicker multiple onClose={() => setPicker(false)} onSelect={add} /> : null}
  </div>
}
