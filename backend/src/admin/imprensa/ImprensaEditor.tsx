'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { TagPicker } from '../friendly/TagPicker'
import { dateInputValue, imprensaBody, imprensaSaveIssue, materiaTags, validateImprensa } from './imprensa-data'
import { IMPRENSA_PATH, type ImprensaDraft, type ImprensaIssue } from './imprensa-model'
import { ImprensaPreview } from './ImprensaPreview'
export function ImprensaEditor({ initial, canSave = true }: { initial: ImprensaDraft; canSave?: boolean }) {
  const router = useRouter()
  const [original, setOriginal] = useState<ImprensaDraft>(initial)
  const [materia, setMateria] = useState<ImprensaDraft>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<ImprensaIssue>()
  const [message, setMessage] = useState('')
  const [tagPicker, setTagPicker] = useState(false)
  const dirty = JSON.stringify(materia) !== JSON.stringify(original)
  const disabled = !canSave || saving
  const tags = materiaTags(materia)
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
  function change(field: string, value: unknown) { setMateria(current => ({ ...current, [field]: value })); setMessage(''); setError(undefined) }
  async function save() {
    const issue = validateImprensa(materia)
    if (issue) { setError({ ...issue }); return }
    setSaving(true); setError(undefined); setMessage('')
    try {
      const body = imprensaBody(materia, original.id ? original : undefined)
      if (!Object.keys(body).length) { setMessage('Nenhuma alteração para salvar.'); return }
      const result = await requestJSON<{ doc: ImprensaDraft }>(`/api/imprensa${original.id ? `/${original.id}` : ''}?depth=1`, { method: original.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      setMateria(result.doc); setOriginal(result.doc)
      setMessage('Matéria salva. O site pode levar alguns minutos para atualizar.')
      if (!original.id && result.doc.id) router.push(`${IMPRENSA_PATH}/${result.doc.id}`)
    } catch (cause) { setError(imprensaSaveIssue(cause)) } finally { setSaving(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>{original.id ? 'Editar matéria' : 'Adicionar matéria'}</h1>{original.id ? <Link className="btn" href={`${IMPRENSA_PATH}/create`}><Icon name="plus" />Adicionar matéria</Link> : null}<span className="sp" /><Link className="lnk" href={IMPRENSA_PATH}>Voltar para Imprensa</Link></div>
    {error ? <p id="bb-imp-error" className="bb-error" role="alert">{error.message}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="prev-wrap"><div className="bb-stack">
      <div className="bb-card"><div className="bd">
        <input id="bb-imp-titulo" className="ttl" aria-label="Título da matéria" aria-invalid={error?.field === 'bb-imp-titulo'} placeholder="Título da matéria" value={materia.titulo} disabled={disabled} onChange={e => change('titulo', e.target.value)} />
        <div className="row2" style={{ marginTop: 12 }}>
          <div className="fld"><label htmlFor="bb-imp-veiculo">Veículo</label><input className="inp" id="bb-imp-veiculo" aria-invalid={error?.field === 'bb-imp-veiculo'} placeholder="Ex.: Valor Econômico" value={materia.veiculo} disabled={disabled} onChange={e => change('veiculo', e.target.value)} /></div>
          <div className="fld"><label htmlFor="bb-imp-data">Data</label><input className="inp" id="bb-imp-data" type="date" aria-invalid={error?.field === 'bb-imp-data'} value={dateInputValue(materia.data)} disabled={disabled} onChange={e => change('data', e.target.value)} /></div>
        </div>
        <div className="fld"><label htmlFor="bb-imp-url">Link da matéria</label><input className="inp" id="bb-imp-url" type="url" placeholder="https://" value={materia.url || ''} disabled={disabled} onChange={e => change('url', e.target.value)} /><span className="help">Endereço da matéria no site do veículo.</span></div>
        <div className="fld"><label htmlFor="bb-imp-resumo">Resumo</label><textarea id="bb-imp-resumo" rows={4} value={materia.resumo || ''} disabled={disabled} onChange={e => change('resumo', e.target.value)} /><span className="help">Resumo da matéria (guardado no painel).</span></div>
        <div className="fld"><span className="lbl">Tags <span className="opt">({tags.length})</span></span>{tags.length ? <div className="bb-camp-chips">{tags.map(t => <span className="bb-camp-chip" key={t.id}>{t.nome}<button type="button" aria-label={`Remover ${t.nome}`} disabled={disabled} onClick={() => change('tags', tags.filter(x => x.id !== t.id))}>×</button></span>)}</div> : <span className="help">Nenhuma tag.</span>}<button type="button" className="btn sm" disabled={disabled} onClick={() => setTagPicker(true)}>Gerenciar tags</button><span className="help">Marque as tags desta matéria. Para criar tags novas, use o menu Tags.</span></div>
      </div><div className="pub"><div className="line" style={{ padding: '0 16px 12px' }}>{dirty ? <span className="bb-warning">Alterações ainda não salvas</span> : <span className="help">Tudo salvo.</span>}</div><div className="foot"><Link className="lnk" href={IMPRENSA_PATH}>Cancelar</Link><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}>{saving ? 'Salvando…' : 'Salvar matéria'}</button></div></div></div>
    </div>
    <div className="prev"><ImprensaPreview materia={materia} /></div></div>
    {tagPicker ? <TagPicker initial={tags} onApply={list => change('tags', list)} onClose={() => setTagPicker(false)} /> : null}
  </section></div>
}
