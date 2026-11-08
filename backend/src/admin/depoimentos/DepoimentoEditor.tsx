'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { HeroImageField } from '../hero/HeroImageField'
import { depoimentoBody, depSaveIssue, depStatus, validateDepoimento } from './depoimento-data'
import { DEPOIMENTO_PATH, type DepoimentoDraft, type DepoimentoIssue } from './depoimento-model'
import { DepoimentoPreview } from './DepoimentoPreview'
export function DepoimentoEditor({ initial, canSave = true }: { initial: DepoimentoDraft; canSave?: boolean }) {
  const router = useRouter()
  const [original, setOriginal] = useState<DepoimentoDraft>(initial)
  const [depoimento, setDepoimento] = useState<DepoimentoDraft>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<DepoimentoIssue>()
  const [message, setMessage] = useState('')
  const dirty = JSON.stringify(depoimento) !== JSON.stringify(original)
  const disabled = !canSave || saving
  const [statusKey, statusLabel] = depStatus(depoimento)
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
  function change(field: string, value: unknown) { setDepoimento(current => ({ ...current, [field]: value })); setMessage(''); setError(undefined) }
  async function save() {
    const issue = validateDepoimento(depoimento)
    if (issue) { setError({ ...issue }); return }
    setSaving(true); setError(undefined); setMessage('')
    try {
      const body = depoimentoBody(depoimento, original.id ? original : undefined)
      if (!Object.keys(body).length) { setMessage('Nenhuma alteração para salvar.'); return }
      const result = await requestJSON<{ doc: DepoimentoDraft }>(`/api/depoimentos${original.id ? `/${original.id}` : ''}?depth=1`, { method: original.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      setDepoimento(result.doc); setOriginal(result.doc)
      setMessage('Depoimento salvo. O site pode levar alguns minutos para atualizar.')
      if (!original.id && result.doc.id) router.push(`${DEPOIMENTO_PATH}/${result.doc.id}`)
    } catch (cause) { setError(depSaveIssue(cause)) } finally { setSaving(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>{original.id ? 'Editar depoimento' : 'Adicionar depoimento'}</h1>{original.id ? <Link className="btn" href={`${DEPOIMENTO_PATH}/create`}><Icon name="plus" />Adicionar depoimento</Link> : null}<span className="sp" /><Link className="lnk" href={DEPOIMENTO_PATH}>Voltar para Depoimentos</Link></div>
    {error ? <p id="bb-dep-error" className="bb-error" role="alert">{error.message}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="prev-wrap"><div className="bb-stack">
      <div className="bb-card"><div className="bd">
        <input id="bb-dep-autor" className="ttl" aria-label="Autor do depoimento" aria-invalid={error?.field === 'bb-dep-autor'} placeholder="Autor (ex.: Lilian Bueno)" value={depoimento.autor} disabled={disabled} onChange={e => change('autor', e.target.value)} />
        <div className="row2" style={{ marginTop: 12 }}>
          <div className="fld"><label htmlFor="bb-dep-empresa">Empresa</label><input className="inp" id="bb-dep-empresa" placeholder="Ex.: Braskem" value={depoimento.empresa || ''} disabled={disabled} onChange={e => change('empresa', e.target.value)} /><span className="help">O site mostra "Autor, Empresa".</span></div>
          <div className="fld"><label htmlFor="bb-dep-ordem">Ordem</label><input className="inp" id="bb-dep-ordem" type="number" value={depoimento.ordem ?? 0} disabled={disabled} onChange={e => change('ordem', e.target.value === '' ? 0 : Number(e.target.value))} /><span className="help">Menor aparece primeiro.</span></div>
        </div>
        <div className="fld"><label htmlFor="bb-dep-texto">Depoimento</label><textarea id="bb-dep-texto" rows={5} aria-invalid={error?.field === 'bb-dep-texto'} value={depoimento.texto} disabled={disabled} onChange={e => change('texto', e.target.value)} /><span className="help">Escreva sem aspas; o site já coloca as aspas.</span></div>
        <HeroImageField label="Foto do autor" help="Opcional. Foto da pessoa que deu o depoimento." value={depoimento.foto} disabled={disabled} onChange={v => change('foto', v)} />
        <label className="bb-check bb-hero-ativo"><input type="checkbox" checked={depoimento.ativo !== false} disabled={disabled} onChange={e => change('ativo', e.target.checked)} />Depoimento ativo (aparece no site)</label>
      </div><div className="pub"><div className="line bb-hero-situacao" style={{ padding: '0 16px 12px' }}>Situação: <span className={`st ${statusKey}`}>{statusLabel}</span>{dirty ? <span className="bb-warning">Alterações ainda não salvas</span> : null}</div><div className="foot"><Link className="lnk" href={DEPOIMENTO_PATH}>Cancelar</Link><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}>{saving ? 'Salvando…' : 'Salvar depoimento'}</button></div></div></div>
    </div>
    <div className="prev"><DepoimentoPreview depoimento={depoimento} /></div></div>
  </section></div>
}
