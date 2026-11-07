"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { activeHero, byHeroOrder } from './hero-data'
import { HERO_PATH, type HeroBanner } from './hero-model'
import { HeroListRow } from './HeroListRow'
import { HeroPreviewDialog } from './HeroPreview'
const FILTERS = [ ['todos', 'Todos', (_banner: HeroBanner) => true], ['ativos', 'Ativos', activeHero], ['inativos', 'Inativos', (banner: HeroBanner) => !activeHero(banner)], ['semmobile', 'Sem imagem de celular', (banner: HeroBanner) => !banner.imagemMobile] ] as const
export function HeroList({ initial, canCreate = true, canUpdate = true }: { initial: HeroBanner[]; canCreate?: boolean; canUpdate?: boolean }) {
  const [banners, setBanners] = useState(initial)
  const [filter, setFilter] = useState('todos')
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState<number>()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState<HeroBanner>()
  const rows = useMemo(() => banners.filter(FILTERS.find(item => item[0] === filter)![2]).filter(banner => banner.nome.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))).sort(byHeroOrder), [banners, filter, search])
  async function toggle(banner: HeroBanner) {
    setBusy(banner.id); setError(''); setMessage('')
    try {
      const result = await requestJSON<{ doc: HeroBanner }>(`/api/hero-slides/${banner.id}?depth=1`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ativo: !activeHero(banner) }) })
      setBanners(current => current.map(item => item.id === banner.id ? result.doc : item))
      setMessage('Alteração salva. A página inicial pode levar alguns minutos para atualizar.')
    } catch (cause) { setError((cause as Error).message) } finally { setBusy(undefined) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Banners do hero</h1>{canCreate ? <Link className="btn" href={`${HERO_PATH}/create`}><Icon name="plus" />Adicionar banner</Link> : null}</div>
    <p className="sub">Carrossel principal da página inicial. Ligue e desligue pela chave.</p>
    <div className="subsub">{FILTERS.map(([key, label, match], index) => <React.Fragment key={key}>{index ? <span className="sep">|</span> : null}<button type="button" className={filter === key ? 'on' : ''} onClick={() => setFilter(key)}>{label} <span className="n">({banners.filter(match).length})</span></button></React.Fragment>)}</div>
    <div className="toolbar"><p className="help bb-hero-list-help">O mês define a prioridade; a ordem desempata dentro de cada grupo.</p><span className="sp" /><input className="inp search" type="search" aria-label="Buscar banners" placeholder="Buscar banners…" value={search} onChange={event => setSearch(event.target.value)} /></div>
    {error ? <p className="bb-error" role="alert">{error}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="bb-table-scroll"><table className="list bb-hero-table"><thead><tr><th>Ordem</th><th>Imagem</th><th>Banner</th><th>Destaque</th><th>Celular</th><th>Status</th><th>Ativo</th></tr></thead><tbody>{rows.map(banner => <HeroListRow key={banner.id} banner={banner} busy={busy !== undefined} canCreate={canCreate} canUpdate={canUpdate} onToggle={() => void toggle(banner)} onPreview={() => setPreview(banner)} />)}{!rows.length ? <tr><td colSpan={7} className="empty">Nenhum banner neste filtro.</td></tr> : null}</tbody></table></div>
    {preview ? <HeroPreviewDialog banner={preview} onClose={() => setPreview(undefined)} /> : null}
  </section></div>
}
