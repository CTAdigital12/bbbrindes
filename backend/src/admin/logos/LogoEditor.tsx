'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { logoBody, logoSaveIssue, validateLogo } from './logo-data'
import { LOGO_ACCEPT, LOGO_PATH, type LogoDraft, type LogoIssue } from './logo-model'
import { LogoPreview } from './LogoPreview'
export function LogoEditor({ initial, canSave = true }: { initial: LogoDraft; canSave?: boolean }) {
  const router = useRouter()
  const [original, setOriginal] = useState<LogoDraft>(initial)
  const [logo, setLogo] = useState<LogoDraft>(initial)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<LogoIssue>()
  const [message, setMessage] = useState('')
  const dirty = file != null || JSON.stringify(logo) !== JSON.stringify(original)
  const disabled = !canSave || saving
  const temArquivo = file != null || Boolean(logo.url)
  const shownImg = preview || logo.url || null
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  useEffect(() => {
    if (!error?.field) return
    const field = document.getElementById(error.field); field?.focus(); field?.scrollIntoView({ block: 'center' })
  }, [error])
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])
  function change(field: string, value: unknown) { setLogo(current => ({ ...current, [field]: value })); setMessage(''); setError(undefined) }
  function pickFile(files: FileList | null) {
    const chosen = files?.[0]
    if (!chosen) return
    if (preview) URL.revokeObjectURL(preview)
    setFile(chosen); setPreview(URL.createObjectURL(chosen)); setMessage(''); setError(undefined)
  }
  async function save() {
    const issue = validateLogo(logo, temArquivo)
    if (issue) { setError({ ...issue }); return }
    const scalar = logoBody(logo, original.id ? original : undefined)
    if (!file && original.id && !Object.keys(scalar).length) { setMessage('Nenhuma alteração para salvar.'); return }
    setSaving(true); setError(undefined); setMessage('')
    try {
      let result: { doc: LogoDraft }
      if (file) {
        // Upload (multipart): arquivo + campos (nome/ordem). Cria o logo ou troca o arquivo.
        const form = new FormData()
        form.append('file', file)
        const payloadFields = original.id ? scalar : { nome: logo.nome, ordem: Number(logo.ordem) || 0 }
        form.append('_payload', JSON.stringify(payloadFields))
        result = await requestJSON(`/api/logos${original.id ? `/${original.id}` : ''}?depth=0`, { method: original.id ? 'PATCH' : 'POST', body: form })
      } else {
        // So nome/ordem mudaram: PATCH em JSON (o arquivo atual e preservado).
        result = await requestJSON(`/api/logos/${original.id}?depth=0`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(scalar) })
      }
      setLogo(result.doc); setOriginal(result.doc); setFile(null)
      if (preview) { URL.revokeObjectURL(preview); setPreview(null) }
      setMessage('Logo salvo. O site pode levar alguns minutos para atualizar.')
      if (!original.id && result.doc.id) router.push(`${LOGO_PATH}/${result.doc.id}`)
    } catch (cause) { setError(logoSaveIssue(cause)) } finally { setSaving(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>{original.id ? 'Editar logo' : 'Adicionar logo'}</h1>{original.id ? <Link className="btn" href={`${LOGO_PATH}/create`}><Icon name="plus" />Adicionar logo</Link> : null}<span className="sp" /><Link className="lnk" href={LOGO_PATH}>Voltar para Logos</Link></div>
    {error ? <p id="bb-logo-error" className="bb-error" role="alert">{error.message}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="prev-wrap"><div className="bb-stack">
      <div className="bb-card"><div className="bd">
        <input id="bb-logo-nome" className="ttl" aria-label="Nome da marca" aria-invalid={error?.field === 'bb-logo-nome'} placeholder="Nome da marca (ex.: Braskem)" value={logo.nome} disabled={disabled} onChange={e => change('nome', e.target.value)} />
        <div className="fld" style={{ marginTop: 12, maxWidth: 200 }}><label htmlFor="bb-logo-ordem">Ordem</label><input className="inp" id="bb-logo-ordem" type="number" value={logo.ordem ?? 0} disabled={disabled} onChange={e => change('ordem', e.target.value === '' ? 0 : Number(e.target.value))} /><span className="help">Menor aparece primeiro no marquee.</span></div>
        <div className="fld" id="bb-logo-file"><span className="lbl">Arquivo do logo</span>
          {shownImg
            ? <div className="imgset"><img src={shownImg} alt={logo.nome || 'Logo'} /><div className="i"><b>{file?.name || logo.filename || 'Arquivo enviado'}</b><div className="acts"><label className="lnk">Trocar arquivo<input type="file" hidden accept={LOGO_ACCEPT} disabled={disabled} onChange={e => pickFile(e.target.files)} /></label></div></div></div>
            : <div className="imgf"><span>Envie o SVG ou PNG da marca</span><div className="row"><label className="btn sm pri">Enviar arquivo<input type="file" hidden accept={LOGO_ACCEPT} disabled={disabled} onChange={e => pickFile(e.target.files)} /></label></div></div>}
          <span className="help">SVG preferível (vetor). PNG e WebP também são aceitos.</span>
        </div>
      </div><div className="pub"><div className="line" style={{ padding: '0 16px 12px' }}>{dirty ? <span className="bb-warning">Alterações ainda não salvas</span> : <span className="help">Tudo salvo.</span>}</div><div className="foot"><Link className="lnk" href={LOGO_PATH}>Cancelar</Link><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}>{saving ? 'Salvando…' : 'Salvar logo'}</button></div></div></div>
    </div>
    <div className="prev"><LogoPreview logo={logo} imagem={shownImg} /></div></div>
  </section></div>
}
