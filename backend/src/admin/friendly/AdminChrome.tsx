'use client'
/* eslint-disable @next/next/no-img-element */
import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from './icons'
import { SITE_URL } from './model'

export type NavItem = { group: string; label: string; href: string; icon: string; badge?: number }
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
  function item(entry: NavItem) {
    const active = entry.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(entry.href)
    return <Link key={entry.href} href={entry.href} className={active ? 'on' : undefined} aria-current={active ? 'page' : undefined} onClick={() => document.body.classList.remove('bb-menu-open')}>
      <Icon name={entry.icon} /><span>{entry.label}</span>{entry.badge ? <span className="cnt" title="Produtos sem foto">{entry.badge}</span> : null}
    </Link>
  }
  return <div className="bb-admin"><nav className="side" aria-label="Menu do painel">
    {items.map((entry, index) => <Fragment key={entry.href}>
      {entry.group && items[index - 1]?.group !== entry.group ? <div className="grp">{entry.group}</div> : null}{item(entry)}
    </Fragment>)}
    {more.length ? <details className="bb-more"><summary>Outras áreas</summary>{more.map(item)}</details> : null}
    <Link className="bb-logout" href="/admin/logout">Sair do painel</Link>
  </nav></div>
}
