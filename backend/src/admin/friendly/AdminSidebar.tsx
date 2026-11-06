import React from 'react'
import type { ServerProps, VisibleEntities } from 'payload'
import { AdminNavigation, type NavItem } from './AdminChrome'
import { NAV_ITEMS, MORE_ITEMS } from './nav'
export default async function AdminSidebar(props: ServerProps & { visibleEntities: VisibleEntities }) {
  if (!props.user) return null
  const collectionRights = props.permissions?.collections ?? {}
  const globalRights = props.permissions?.globals ?? {}
  function allowed(item: NavItem) {
    const [, , type, slug] = item.href.split('/')
    if (type === 'collections') return props.visibleEntities.collections.some(visible => visible === slug) && Boolean(collectionRights[slug]?.read)
    if (type === 'globals') return props.visibleEntities.globals.some(visible => visible === slug) && Boolean(globalRights[slug]?.read)
    return true
  }
  const items = NAV_ITEMS.filter(allowed).map(item => ({ ...item }))
  const products = items.find(item => item.href.endsWith('/produtos'))
  if (products) {
    const result = await props.payload.count({ collection: 'produtos', where: { imagens: { exists: false } }, overrideAccess: false, user: props.user })
    products.badge = result.totalDocs
  }
  return <AdminNavigation items={items} more={MORE_ITEMS.filter(allowed)} />
}
