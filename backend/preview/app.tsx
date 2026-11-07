import React from 'react'
import Link from 'next/link'
import { createRoot } from 'react-dom/client'
import { AdminBar, AdminNavigation } from '../src/admin/friendly/AdminChrome'
import { NAV_ITEMS, MORE_ITEMS } from '../src/admin/friendly/nav'
import { Dashboard } from '../src/admin/friendly/Dashboard'
import { dashboardData } from '../src/admin/friendly/dashboard-data'
import { ProductsList } from '../src/admin/friendly/ProductsList'
import { ProductEditor } from '../src/admin/friendly/ProductEditor'
import { copyProduct } from '../src/admin/friendly/product-data'
import { HeroList } from '../src/admin/hero/HeroList'
import { HeroEditor } from '../src/admin/hero/HeroEditor'
import { copyHero, newHero } from '../src/admin/hero/hero-data'
import type { HeroBanner } from '../src/admin/hero/hero-model'
import type { Banner, Category, Media, Product } from '../src/admin/friendly/model'
import '../src/admin/friendly/mockup.scss'
import '../src/admin/friendly/layout.scss'
import './preview.css'
type Data = { products: Product[]; categories: Category[]; media: Media[]; banners: Banner[]; certifications: number }
async function main() {
 const response = await fetch('/preview-data')
 const data: Data = await response.json()
 const dashboard = dashboardData(data.products, data.banners, data.media.slice(0,10), data.media.length, data.certifications, new Date().getMonth()+1)
 const items = NAV_ITEMS.map(item => ({ ...item, badge: item.href.endsWith('/produtos') ? dashboard.withoutPhoto : undefined }))
 const pathname = window.location.pathname
 const parts = pathname.split('/').filter(Boolean)
 const query = new URLSearchParams(window.location.search)
 const banners = data.banners as unknown as HeroBanner[]
 let page = <Dashboard data={dashboard} name="Fabio" greeting="Boa tarde" />
 if (pathname === '/admin/collections/produtos') page = <ProductsList products={data.products} categories={data.categories} initialFilter={query.get('f') ?? 'todos'} />
 else if (parts[1] === 'collections' && parts[2] === 'produtos' && parts[3]) page = previewProduct(data, parts[3], query.get('copiar'))
 else if (pathname === '/admin/collections/hero-slides') page = <HeroList initial={banners} />
 else if (parts[1] === 'collections' && parts[2] === 'hero-slides' && parts[3]) page = previewHero(banners, parts[3], query.get('copiar'))
 else if (pathname !== '/admin') page = <div className="bb-admin"><section className="bb-page"><h1>{items.find(item => item.href === pathname)?.label ?? 'Área do painel'}</h1><p>Esta área será adaptada na próxima etapa. O primeiro conjunto contempla Painel, Produtos e Banners.</p><Link href="/admin">Voltar ao painel</Link></section></div>
 createRoot(document.getElementById('root')!).render(<><AdminBar name="Fabio" /><AdminNavigation items={items} more={MORE_ITEMS} /><div className="bb-preview-content template-default__wrap">{page}</div><aside className="bb-preview-note"><b>Prévia local para validação</b>Dados atuais do catálogo. Edições nesta prévia ficam somente na memória local e não alteram a produção.</aside></>)
}
main().catch(error => { document.getElementById('root')!.textContent = `Não foi possível abrir a prévia: ${error.message}` })

function previewProduct(data: Data, id: string, copy: string | null) {
 const original = data.products.find(p => p.id === Number(id === 'create' ? copy : id))
 const initial: Product = { nome:'', codigoSite:'', quantidadeMinima:500, categorias:[], imagens:[], cores:[], canais:{site:false} }
 const product = id === 'create' ? original ? copyProduct(original) : initial : original
 return product ? <ProductEditor initial={product} categories={data.categories} /> : <div className="bb-admin"><section className="bb-page">Produto não encontrado</section></div>
}

function previewHero(banners: HeroBanner[], id: string, copy: string | null) {
 const source = banners.find(b => b.id === Number(id === 'create' ? copy : id))
 if (id === 'create') return <HeroEditor initial={source ? copyHero(source) : newHero(new Date().getMonth() + 1)} />
 return source ? <HeroEditor initial={source} /> : <div className="bb-admin"><section className="bb-page">Banner não encontrado</section></div>
}
