'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { HeroImageField } from '../hero/HeroImageField'
import { TagPicker } from '../friendly/TagPicker'
import { caseBody, caseSaveIssue, caseTags, validateCase } from './cases-data'
import { CASE_PATH, type CaseDraft, type CaseIssue } from './cases-model'
import { CasePreview } from './CasePreview'
export function CaseEditor({ initial, canSave = true }: { initial: CaseDraft; canSave?: boolean }) {
  const router = useRouter()
  const [original, setOriginal] = useState<CaseDraft>(initial)
  const [caseItem, setCaseItem] = useState<CaseDraft>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<CaseIssue>()
  const [message, setMessage] = useState('')
  const [tagPicker, setTagPicker] = useState(false)
  const dirty = JSON.stringify(caseItem) !== JSON.stringify(original)
  const disabled = !canSave || saving
  const tags = caseTags(caseItem)
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
  function change(field: string, value: unknown) { setCaseItem(current => ({ ...current, [field]: value })); setMessage(''); setError(undefined) }
  function changeDepo(key: 'texto' | 'autor', value: string) { setCaseItem(current => ({ ...current, depoimento: { ...(current.depoimento ?? {}), [key]: value } })); setMessage(''); setError(undefined) }
  async function save() {
    const issue = validateCase(caseItem)
    if (issue) { setError({ ...issue }); return }
    setSaving(true); setError(undefined); setMessage('')
    try {
      const body = caseBody(caseItem, original.id ? original : undefined)
      if (!Object.keys(body).length) { setMessage('Nenhuma alteração para salvar.'); return }
      const result = await requestJSON<{ doc: CaseDraft }>(`/api/cases${original.id ? `/${original.id}` : ''}?depth=1`, { method: original.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      setCaseItem(result.doc); setOriginal(result.doc)
      setMessage('Case salvo. O site pode levar alguns minutos para atualizar.')
      if (!original.id && result.doc.id) router.push(`${CASE_PATH}/${result.doc.id}`)
    } catch (cause) { setError(caseSaveIssue(cause)) } finally { setSaving(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>{original.id ? 'Editar case' : 'Adicionar case'}</h1>{original.id ? <Link className="btn" href={`${CASE_PATH}/create`}><Icon name="plus" />Adicionar case</Link> : null}<span className="sp" /><Link className="lnk" href={CASE_PATH}>Voltar para Cases</Link></div>
    {error ? <p id="bb-cases-error" className="bb-error" role="alert">{error.message}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="prev-wrap"><div className="bb-stack">
      <div className="bb-card"><div className="bd">
        <input id="bb-cases-titulo" className="ttl" aria-label="Título do case" aria-invalid={error?.field === 'bb-cases-titulo'} placeholder="Título do case" value={caseItem.titulo} disabled={disabled} onChange={e => change('titulo', e.target.value)} />
        <div className="row2" style={{ marginTop: 12 }}>
          <div className="fld"><label htmlFor="bb-cases-cliente">Cliente</label><input className="inp" id="bb-cases-cliente" aria-invalid={error?.field === 'bb-cases-cliente'} placeholder="Ex.: Coca-Cola" value={caseItem.cliente} disabled={disabled} onChange={e => change('cliente', e.target.value)} /><span className="help">Aparece na faixa de marca do card.</span></div>
          <div className="fld"><label htmlFor="bb-cases-segmento">Segmento</label><input className="inp" id="bb-cases-segmento" placeholder="Ex.: Bebidas · Brinde funcional" value={caseItem.segmento || ''} disabled={disabled} onChange={e => change('segmento', e.target.value)} /></div>
        </div>
        <div className="fld"><label htmlFor="bb-cases-resumo">Resumo</label><textarea id="bb-cases-resumo" rows={4} value={caseItem.resumo || ''} disabled={disabled} onChange={e => change('resumo', e.target.value)} /><span className="help">Descrição curta exibida no card da página de cases.</span></div>
        <div className="fld"><span className="lbl">Depoimento <span className="opt">(opcional)</span></span>
          <textarea id="bb-cases-depo-texto" rows={3} placeholder="Texto do depoimento" value={caseItem.depoimento?.texto || ''} disabled={disabled} onChange={e => changeDepo('texto', e.target.value)} />
          <input className="inp" id="bb-cases-depo-autor" placeholder="Autor do depoimento" value={caseItem.depoimento?.autor || ''} disabled={disabled} onChange={e => changeDepo('autor', e.target.value)} style={{ marginTop: 8 }} />
        </div>
        <HeroImageField label="Logo do cliente" help="Opcional. O site usa hoje a faixa de marca com o nome; o logo fica guardado para uso futuro." value={caseItem.logo} disabled={disabled} onChange={v => change('logo', v)} />
        <HeroImageField label="Imagem do case" help="Opcional. Guardada no painel; hoje o card não exibe foto por case." value={caseItem.imagem} disabled={disabled} onChange={v => change('imagem', v)} />
        <div className="fld"><span className="lbl">Tags <span className="opt">({tags.length})</span></span>{tags.length ? <div className="bb-camp-chips">{tags.map(t => <span className="bb-camp-chip" key={t.id}>{t.nome}<button type="button" aria-label={`Remover ${t.nome}`} disabled={disabled} onClick={() => change('tags', tags.filter(x => x.id !== t.id))}>×</button></span>)}</div> : <span className="help">Nenhuma tag.</span>}<button type="button" className="btn sm" disabled={disabled} onClick={() => setTagPicker(true)}>Gerenciar tags</button><span className="help">Marque as tags deste case. Para criar tags novas, use o menu Tags.</span></div>
      </div><div className="pub"><div className="line" style={{ padding: '0 16px 12px' }}>{dirty ? <span className="bb-warning">Alterações ainda não salvas</span> : <span className="help">Tudo salvo.</span>}</div><div className="foot"><Link className="lnk" href={CASE_PATH}>Cancelar</Link><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}>{saving ? 'Salvando…' : 'Salvar case'}</button></div></div></div>
    </div>
    <div className="prev"><CasePreview caseItem={caseItem} /></div></div>
    {tagPicker ? <TagPicker initial={tags} onApply={list => change('tags', list)} onClose={() => setTagPicker(false)} /> : null}
  </section></div>
}
