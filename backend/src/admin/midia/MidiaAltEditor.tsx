'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { requestJSON, replaceImage } from '../friendly/api'
import { useDialog } from '../friendly/useDialog'
import { altBody, altSaveIssue, fileSizeLabel, validateAlt, validateReplaceFile, replaceSaveIssue, MIDIA_ACCEPT, type MidiaIssue } from './midia-data'
import type { Media } from '../friendly/model'
type MediaExtra = Media & { filesize?: number | null; width?: number | null; height?: number | null }
// Modal da imagem: duas acoes independentes. (1) editar a descricao (alt), gravada
// com PATCH /api/media/:id { alt }. (2) "Substituir arquivo": troca a imagem em si
// mantendo a descricao, com PATCH multipart /api/media/:id (file), igual ao upload
// de imagem nova so que no id que ja existe.
export function MidiaAltEditor({ media, canUpdate, onClose, onSaved }: {
  media: MediaExtra; canUpdate: boolean; onClose: () => void; onSaved: (media: Media, note?: string) => void
}) {
  const [alt, setAlt] = useState(media.alt || '')
  const [saving, setSaving] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<MidiaIssue>()
  const dialog = useDialog(onClose, '#bb-midia-alt')
  const busy = saving || swapping
  const disabled = !canUpdate || busy
  useEffect(() => {
    if (!error?.field) return
    document.getElementById(error.field)?.focus()
  }, [error])
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])
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
  function pickFile(files: FileList | null) {
    const chosen = files?.[0] || null
    const issue = validateReplaceFile(chosen)
    if (issue) { setError({ ...issue }); return }
    if (preview) URL.revokeObjectURL(preview)
    setFile(chosen); setPreview(chosen ? URL.createObjectURL(chosen) : null); setError(undefined)
  }
  function clearFile() {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null); setPreview(null); setError(undefined)
  }
  async function replace() {
    const issue = validateReplaceFile(file)
    if (issue) { setError({ ...issue }); return }
    setSwapping(true); setError(undefined)
    try {
      const doc = await replaceImage(media.id, file as File, media.alt)
      // Desvia o cache do navegador: se o endereco da imagem nao mudar (mesmo nome de
      // arquivo), o src igual nao recarregaria a miniatura. O ?v= forca o refresh.
      const url = doc.url ? `${doc.url}${doc.url.includes('?') ? '&' : '?'}v=${Date.now()}` : doc.url
      onSaved({ ...doc, url }, 'Arquivo trocado. O site pode levar alguns minutos para atualizar.')
    } catch (cause) { setError(replaceSaveIssue(cause)) } finally { setSwapping(false) }
  }
  const dims = media.width && media.height ? `${media.width} x ${media.height}px` : ''
  const size = fileSizeLabel(media)
  const meta = [media.filename, dims, size].filter(Boolean).join('  ·  ')
  return <div className="ov" onClick={e => { if (e.target === e.currentTarget) onClose() }}><div ref={dialog} className="modal bb-midia-modal" role="dialog" aria-modal="true" aria-labelledby="bb-midia-mt">
    <div className="mh"><h2 id="bb-midia-mt">Descricao da imagem</h2><span className="sp" /><button type="button" className="x-btn" aria-label="Fechar" onClick={onClose}>×</button></div>
    <div className="bb-midia-edit">
      <div className="bb-midia-edit-foto">{(preview || media.url) ? <img src={preview || media.url || ''} alt={media.alt || ''} /> : <span className="nofoto">Sem imagem</span>}</div>
      <div className="bb-midia-edit-form">
        {error ? <p className="bb-error" role="alert">{error.message}</p> : null}
        <label htmlFor="bb-midia-alt">Descricao (alt)</label>
        <textarea id="bb-midia-alt" rows={3} value={alt} disabled={disabled} aria-invalid={error?.field === 'bb-midia-alt'} placeholder='Ex.: Squeeze 550 ml verde com a marca da empresa' onChange={e => { setAlt(e.target.value); setError(undefined) }} />
        <span className="help">Serve pro Google entender a imagem e pra quem usa leitor de tela.</span>
        {meta ? <p className="bb-midia-meta">{meta}</p> : null}
        <div className="bb-midia-swap" id="bb-midia-file">
          <span className="lbl">Arquivo da imagem</span>
          {preview
            ? <div className="imgset"><img src={preview} alt="" /><div className="i"><b>{file?.name}</b><div className="acts"><button type="button" className="btn sm pri" disabled={disabled} onClick={() => void replace()}>{swapping ? 'Trocando…' : 'Confirmar troca'}</button><button type="button" className="lnk" disabled={disabled} onClick={clearFile}>Cancelar troca</button></div></div></div>
            : <div className="acts"><label className="btn sm ghost">Substituir arquivo<input type="file" hidden accept={MIDIA_ACCEPT} disabled={disabled} onChange={e => pickFile(e.target.files)} /></label></div>}
          <span className="help">Troca a imagem e mantem esta descricao. Envie uma imagem de ate 15 MB.</span>
        </div>
      </div>
    </div>
    <div className="mf"><span className="sp" /><button type="button" className="btn ghost" onClick={onClose}>Cancelar</button><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}>{saving ? 'Salvando…' : 'Salvar descricao'}</button></div>
  </div></div>
}
