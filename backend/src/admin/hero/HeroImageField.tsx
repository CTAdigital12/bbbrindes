'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { uploadImage } from '../friendly/api'
import { MediaPicker } from '../friendly/MediaPicker'
import { photo, type MediaRef } from '../friendly/model'
// Campo de uma imagem (desktop OU mobile do banner). Reutiliza a biblioteca e o
// upload do admin de Produtos. Nao atribui imagem sozinho: tudo parte do usuario.
export function HeroImageField({ label, help, value, onChange, disabled = false }: {
  label: string; help: string; value: MediaRef | undefined; onChange: (media: MediaRef | null) => void; disabled?: boolean
}) {
  const [picker, setPicker] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const current = photo(value)
  async function upload(files: FileList | null) {
    if (!files?.length) return
    setBusy(true); setError('')
    try { onChange(await uploadImage(files[0])) } catch (cause) { setError((cause as Error).message) } finally { setBusy(false) }
  }
  return <div className="fld"><span className="lbl">{label}</span>
    {error ? <p role="alert" className="bb-error">{error}</p> : null}
    {current?.url
      ? <div className="imgset wide"><img src={current.url} alt={current.alt || label} /><div className="i"><b>{current.filename || 'Imagem escolhida'}</b><div className="acts"><button type="button" className="lnk" disabled={disabled} onClick={() => setPicker(true)}>Trocar</button><button type="button" className="lnk red" disabled={disabled} onClick={() => onChange(null)}>Remover</button></div></div></div>
      : <div className="imgf"><span>Arraste a imagem aqui</span><div className="row"><label className="btn sm pri">Enviar imagem<input type="file" hidden accept="image/*" disabled={disabled || busy} onChange={event => void upload(event.target.files)} /></label><button type="button" className="btn sm ghost" disabled={disabled} onClick={() => setPicker(true)}>Escolher da biblioteca</button></div></div>}
    <span className="help">{help}</span>{busy ? <p role="status">Enviando imagem…</p> : null}
    {picker ? <MediaPicker onClose={() => setPicker(false)} onSelect={images => { if (images[0]) onChange(images[0]) }} /> : null}
  </div>
}
