'use client'
/* eslint-disable @next/next/no-img-element */
import React, { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from './icons'
import { SITE_URL } from './model'

export type NavItem = { group: string; label: string; href: string; icon: string; badge?: number }
const useBrowserLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
export function AdminBar({ name }: { name: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => { setOpen(false); document.body.classList.remove('bb-menu-open') }, [pathname])
  return <div className="bb-admin"><header className="bar">
    <button type="button" className="bb-menu-toggle" aria-label="Abrir menu" aria-expanded={open} onClick={() => { setOpen(!open); document.body.classList.toggle('bb-menu-open', !open) }}>☰</button>
    <Link className="brand" href="/admin"><img src="/admin-brand/bb-brindes.webp" alt="BB Brindes" />Painel</Link>
    <a href={SITE_URL} target="_blank" rel="noopener noreferrer">↗ Ver site</a>
    <Link href="/admin/collections/produtos/create">+ Novo</Link><span className="sp" />
    <Link className="user" href="/admin/account"><span className="av">{name.slice(0, 2).toUpperCase()}</span>Olá, {name}</Link>
  </header></div>
}
export function AdminNavigation({ items, more = [] }: { items: NavItem[]; more?: NavItem[] }) {
  const pathname = usePathname()
  const moreActive = more.some(entry => (pathname ?? '').startsWith(entry.href))
  const [morePref, setMorePref] = useState(false)
  useEffect(() => {
    try { setMorePref(localStorage.getItem('bb-more-open') === '1') } catch { /* sem storage disponivel */ }
  }, [])
  const moreOpen = moreActive || morePref
  function handleMoreToggle(event: React.SyntheticEvent<HTMLDetailsElement>) {
    const next = event.currentTarget.open
    setMorePref(next)
    try { localStorage.setItem('bb-more-open', next ? '1' : '0') } catch { /* sem storage disponivel */ }
  }
  const navRef = useRef<HTMLElement>(null)
  useBrowserLayoutEffect(() => {
    const el = navRef.current
    if (!el) return
    try { const saved = sessionStorage.getItem('bb-nav-scroll'); if (saved) el.scrollTop = Number(saved) } catch { /* sem storage disponivel */ }
    const onScroll = () => { try { sessionStorage.setItem('bb-nav-scroll', String(el.scrollTop)) } catch { /* sem storage disponivel */ } }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])
  function item(entry: NavItem) {
    const active = entry.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(entry.href)
    return <Link key={entry.href} href={entry.href} className={active ? 'on' : undefined} aria-current={active ? 'page' : undefined} onClick={() => document.body.classList.remove('bb-menu-open')}>
      <Icon name={entry.icon} /><span>{entry.label}</span>{entry.badge ? <span className="cnt" title="Produtos sem foto">{entry.badge}</span> : null}
    </Link>
  }
  return <div className="bb-admin"><nav className="side" aria-label="Menu do painel" ref={navRef}>
    {items.map((entry, index) => <Fragment key={entry.href}>
      {entry.group && items[index - 1]?.group !== entry.group ? <div className="grp">{entry.group}</div> : null}{item(entry)}
    </Fragment>)}
    {more.length ? <details className="bb-more" open={moreOpen} onToggle={handleMoreToggle}><summary>Outras áreas</summary>{more.map(item)}</details> : null}
    <Link className="bb-logout" href="/admin/logout">Sair do painel</Link>
  </nav></div>
}
