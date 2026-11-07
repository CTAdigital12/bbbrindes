'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { HeroContentFields, HeroExhibitionFields } from './HeroFields'
import { HeroPreview } from './HeroPreview'
import { heroBody, heroSaveIssue, heroStatus, validateHero } from './hero-data'
import { HERO_PATH, type HeroDraft, type HeroIssue } from './hero-model'
export function HeroEditor({ initial, canSave = true }: { initial: HeroDraft; canSave?: boolean }) {
  const router = useRouter()
  const [original, setOriginal] = useState<HeroDraft>(initial)
  const [banner, setBanner] = useState<HeroDraft>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<HeroIssue>()
  const [message, setMessage] = useState('')
  const dirty = JSON.stringify(banner) !== JSON.stringify(original)
  const disabled = !canSave || saving
  const [statusKey, statusLabel] = heroStatus(banner)
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  useEffect(() => {
    if (!error?.field) return
    const field = document.getElementById(error.field)
    field?.focus(); field?.scrollIntoView({ block: 'center' })
  }, [error])
  function change(field: string, value: unknown) { setBanner(current => ({ ...current, [field]: value })); setMessage(''); setError(undefined) }
  async function save() {
    const issue = validateHero(banner)
    if (issue) { setError({ ...issue }); return }
    setSaving(true); setError(undefined); setMessage('')
    try {
      const body = heroBody(banner, original.id ? original : undefined)
      if (!Object.keys(body).length) { setMessage('Nenhuma alteração para salvar.'); return }
      const result = await requestJSON<{ doc: HeroDraft }>(`/api/hero-slides${original.id ? `/${original.id}` : ''}?depth=1`, { method: original.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      setBanner(result.doc); setOriginal(result.doc)
      setMessage('Banner salvo. A página inicial pode levar alguns minutos para atualizar.')
      if (!original.id && result.doc.id) router.push(`${HERO_PATH}/${result.doc.id}`)
    } catch (cause) { setError(heroSaveIssue(cause)) } finally { setSaving(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>{original.id ? 'Editar banner' : 'Adicionar banner'}</h1>{original.id ? <Link className="btn" href={`${HERO_PATH}/create`}><Icon name="plus" />Adicionar banner</Link> : null}<span className="sp" /><Link className="lnk" href={HERO_PATH}>Voltar para Banners</Link></div>
    {error ? <p id="bb-hero-error" className="bb-error" role="alert">{error.message}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="prev-wrap"><div className="bb-stack">
      <div className="bb-card"><div className="bd"><HeroContentFields banner={banner} change={change} disabled={disabled} errorField={error?.field} /></div></div>
      <div className="bb-card"><div className="hd">Exibição</div><div className="bd"><HeroExhibitionFields banner={banner} change={change} disabled={disabled} errorField={error?.field} /><div className="line bb-hero-situacao">Situação: <span className={`st ${statusKey}`}>{statusLabel}</span>{dirty ? <span className="bb-warning">Alterações ainda não salvas</span> : null}</div></div>
        <div className="pub"><div className="foot"><Link className="lnk" href={HERO_PATH}>Cancelar</Link><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}>{saving ? 'Salvando…' : 'Salvar banner'}</button></div></div></div>
    </div>
    <div className="prev"><HeroPreview banner={banner} /></div></div>
  </section></div>
}
