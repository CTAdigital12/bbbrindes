'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { tagBody, tagSaveIssue, validateTag } from './tags-data'
import { TAG_PATH, type TagDraft, type TagIssue } from './tags-model'
import { TagPreview } from './TagPreview'
export function TagEditor({ initial, canSave = true, usosCount }: { initial: TagDraft; canSave?: boolean; usosCount?: number }) {
  const router = useRouter()
  const [original, setOriginal] = useState<TagDraft>(initial)
  const [tag, setTag] = useState<TagDraft>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<TagIssue>()
  const [message, setMessage] = useState('')
  const dirty = JSON.stringify(tag) !== JSON.stringify(original)
  const disabled = !canSave || saving
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
  function change(field: string, value: unknown) { setTag(current => ({ ...current, [field]: value })); setMessage(''); setError(undefined) }
  async function save() {
    const issue = validateTag(tag)
    if (issue) { setError({ ...issue }); return }
    setSaving(true); setError(undefined); setMessage('')
    try {
      const body = tagBody(tag, original.id ? original : undefined)
      if (!Object.keys(body).length) { setMessage('Nenhuma alteracao para salvar.'); return }
      const result = await requestJSON<{ doc: TagDraft }>(`/api/tags${original.id ? `/${original.id}` : ''}?depth=0`, { method: original.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      setTag(result.doc); setOriginal(result.doc)
      setMessage('Tag salva. O site pode levar alguns minutos para atualizar.')
      if (!original.id && result.doc.id) router.push(`${TAG_PATH}/${result.doc.id}`)
    } catch (cause) { setError(tagSaveIssue(cause)) } finally { setSaving(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>{original.id ? 'Editar tag' : 'Adicionar tag'}</h1>{original.id ? <Link className="btn" href={`${TAG_PATH}/create`}><Icon name="plus" />Adicionar tag</Link> : null}<span className="sp" /><Link className="lnk" href={TAG_PATH}>Voltar para Tags</Link></div>
    {error ? <p id="bb-tag-error" className="bb-error" role="alert">{error.message}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="prev-wrap"><div className="bb-stack">
      <div className="bb-card"><div className="bd">
        <input id="bb-tag-nome" className="ttl" aria-label="Nome da tag" aria-invalid={error?.field === 'bb-tag-nome'} placeholder="Nome da tag" value={tag.nome} disabled={disabled} onChange={e => change('nome', e.target.value)} />
        <p className="bb-tag-help help">O endereco (slug) e gerado do nome e fica bloqueado para edicao. {tag.slug ? <>Atual: <code>{tag.slug}</code>.</> : 'Sera gerado ao salvar.'}</p>
      </div><div className="pub"><div className="line" style={{ padding: '0 16px 12px' }}>{dirty ? <span className="bb-warning">Alteracoes ainda nao salvas</span> : <span className="help">Tudo salvo.</span>}</div><div className="foot"><Link className="lnk" href={TAG_PATH}>Cancelar</Link><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}>{saving ? 'Salvando…' : 'Salvar tag'}</button></div></div></div>
    </div>
    <div className="prev"><TagPreview tag={tag} usosCount={usosCount} /></div></div>
  </section></div>
}
