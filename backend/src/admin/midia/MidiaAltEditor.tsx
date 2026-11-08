'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { requestJSON } from '../friendly/api'
import { useDialog } from '../friendly/useDialog'
import { altBody, altSaveIssue, fileSizeLabel, validateAlt, type MidiaIssue } from './midia-data'
import type { Media } from '../friendly/model'
type MediaExtra = Media & { filesize?: number | null; width?: number | null; height?: number | null }
// Modal para editar a descricao (alt) de uma imagem. So a descricao e editavel; o
// arquivo em si nao muda aqui. Grava com PATCH /api/media/:id { alt }.
export function MidiaAltEditor({ media, canUpdate, onClose, onSaved }: {
  media: MediaExtra; canUpdate: boolean; onClose: () => void; onSaved: (media: Media) => void
}) {
  const [alt, setAlt] = useState(media.alt || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<MidiaIssue>()
  const dialog = useDialog(onClose, '#bb-midia-alt')
  const disabled = !canUpdate || saving
  useEffect(() => {
    if (!error?.field) return
    document.getElementById(error.field)?.focus()
  }, [error])
  async function save() {
    const issue = validateAlt(alt)
    if (issue) { setError({ ...issue }); return }
    const body = altBody(alt, media.alt || '')
    if (!Object.keys(body).length) { onClose(); return }
    setSaving(true); setError(undefined)
    try {
      const result = await requestJSON<{ doc: Media }>(`/api/media/${media.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      onSaved(result.doc)
    } catch (cause) { setError(altSaveIssue(cause)) } finally { setSaving(false) }
  }
  const dims = media.width && media.height ? `${media.width} x ${media.height}px` : ''
  const size = fileSizeLabel(media)
  const meta = [media.filename, dims, size].filter(Boolean).join('  ·  ')
  return <div className="ov" onClick={e => { if (e.target === e.currentTarget) onClose() }}><div ref={dialog} className="modal bb-midia-modal" role="dialog" aria-modal="true" aria-labelledby="bb-midia-mt">
    <div className="mh"><h2 id="bb-midia-mt">Descricao da imagem</h2><span className="sp" /><button type="button" className="x-btn" aria-label="Fechar" onClick={onClose}>×</button></div>
    <div className="bb-midia-edit">
      <div className="bb-midia-edit-foto">{media.url ? <img src={media.url} alt={media.alt || ''} /> : <span className="nofoto">Sem imagem</span>}</div>
      <div className="bb-midia-edit-form">
        {error ? <p className="bb-error" role="alert">{error.message}</p> : null}
        <label htmlFor="bb-midia-alt">Descricao (alt)</label>
        <textarea id="bb-midia-alt" rows={3} value={alt} disabled={disabled} aria-invalid={error?.field === 'bb-midia-alt'} placeholder='Ex.: Squeeze 550 ml verde com a marca da empresa' onChange={e => { setAlt(e.target.value); setError(undefined) }} />
        <span className="help">Serve pro Google entender a imagem e pra quem usa leitor de tela.</span>
        {meta ? <p className="bb-midia-meta">{meta}</p> : null}
      </div>
    </div>
    <div className="mf"><span className="sp" /><button type="button" className="btn ghost" onClick={onClose}>Cancelar</button><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}>{saving ? 'Salvando…' : 'Salvar descricao'}</button></div>
  </div></div>
}
