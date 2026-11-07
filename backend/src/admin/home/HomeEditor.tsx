'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { HomeSelosBlock, HomeDiferenciaisBlock, HomeUrgenciaBlock, HomeEcoBannerBlock, HomeEcoLeadBlock, HomeDepoimentosBlock, HomeFaqBlock, HomeCtaFinalBlock } from './HomeBlocks'
import { HomePreview } from './HomePreview'
import { homeBody, homeSaveIssue, validateHome, type HomeIssue } from './home-data'
import type { HomeContent } from './home-model'
export function HomeEditor({ initial, canSave = true }: { initial: HomeContent; canSave?: boolean }) {
  const [original, setOriginal] = useState<HomeContent>(initial)
  const [home, setHome] = useState<HomeContent>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<HomeIssue>()
  const [message, setMessage] = useState('')
  const dirty = JSON.stringify(home) !== JSON.stringify(original)
  const disabled = !canSave || saving
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  function change(field: string, value: unknown) { setHome(current => ({ ...current, [field]: value })); setMessage(''); setError(undefined) }
  async function save() {
    const issue = validateHome(home)
    if (issue) { setError(issue); return }
    setSaving(true); setError(undefined); setMessage('')
    try {
      await requestJSON('/api/globals/conteudo-home?depth=1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(homeBody(home)) })
      setOriginal(home)
      setMessage('Página inicial salva. O site pode levar alguns minutos para atualizar.')
    } catch (cause) { setError(homeSaveIssue(cause)) } finally { setSaving(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Página inicial</h1>{dirty ? <span className="pill-draft">Alterações não salvas</span> : null}<span className="sp" /><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}><Icon name="up" />{saving ? 'Salvando…' : 'Salvar alterações'}</button></div>
    <p className="sub">Edite os blocos da home. Nada vai para o site até salvar, e o site reconstrói em alguns minutos.</p>
    {error ? <p id="bb-home-error" className="bb-error" role="alert">{error.message}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="prev-wrap"><div>
      <details className="blk"><summary><Icon name="banner" /> Banners do topo <small>· tela própria</small><span className="chev">▾</span></summary><div className="in"><p className="sub bb-home-hint">Os banners do carrossel têm tela própria, com tipo, mês e chave de ativo.</p><Link className="btn sm" href="/admin/collections/hero-slides">Gerenciar banners</Link></div></details>
      <HomeSelosBlock home={home} change={change} disabled={disabled} />
      <HomeDiferenciaisBlock home={home} change={change} disabled={disabled} />
      <HomeUrgenciaBlock home={home} change={change} disabled={disabled} />
      <HomeEcoBannerBlock home={home} change={change} disabled={disabled} />
      <HomeEcoLeadBlock home={home} change={change} disabled={disabled} />
      <HomeDepoimentosBlock home={home} change={change} disabled={disabled} />
      <HomeFaqBlock home={home} change={change} disabled={disabled} />
      <HomeCtaFinalBlock home={home} change={change} disabled={disabled} />
    </div>
    <div className="prev"><HomePreview home={home} /></div></div>
  </section></div>
}
