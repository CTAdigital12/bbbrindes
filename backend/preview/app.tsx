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
import { HomeEditor } from '../src/admin/home/HomeEditor'
import type { HomeContent } from '../src/admin/home/home-model'
import { CampanhaList } from '../src/admin/campanhas/CampanhaList'
import { CampanhaEditor } from '../src/admin/campanhas/CampanhaEditor'
import { copyCampanha, newCampanha } from '../src/admin/campanhas/campanha-data'
import type { CampanhaRow } from '../src/admin/campanhas/campanha-model'
import { CategoriaList } from '../src/admin/categorias/CategoriaList'
import { CategoriaEditor } from '../src/admin/categorias/CategoriaEditor'
import { copyCategoria, newCategoria } from '../src/admin/categorias/categoria-data'
import type { CategoriaRow } from '../src/admin/categorias/categoria-model'
import { CaseList } from '../src/admin/cases/CaseList'
import { CaseEditor } from '../src/admin/cases/CaseEditor'
import { copyCase, newCase } from '../src/admin/cases/cases-data'
import type { CaseRow } from '../src/admin/cases/cases-model'
import { ImprensaList } from '../src/admin/imprensa/ImprensaList'
import { ImprensaEditor } from '../src/admin/imprensa/ImprensaEditor'
import { copyImprensa, newImprensa } from '../src/admin/imprensa/imprensa-data'
import type { ImprensaRow } from '../src/admin/imprensa/imprensa-model'
import { PostList } from '../src/admin/posts/PostList'
import { PostEditor } from '../src/admin/posts/PostEditor'
import { copyPost, newPost } from '../src/admin/posts/post-data'
import type { PostRow } from '../src/admin/posts/post-model'
import { DepoimentoList } from '../src/admin/depoimentos/DepoimentoList'
import { DepoimentoEditor } from '../src/admin/depoimentos/DepoimentoEditor'
import { copyDepoimento, newDepoimento } from '../src/admin/depoimentos/depoimento-data'
import type { DepoimentoRow } from '../src/admin/depoimentos/depoimento-model'
import { LogoList } from '../src/admin/logos/LogoList'
import { LogoEditor } from '../src/admin/logos/LogoEditor'
import { newLogo } from '../src/admin/logos/logo-data'
import type { LogoRow } from '../src/admin/logos/logo-model'
import { MidiaList } from '../src/admin/midia/MidiaList'
import { OrcamentoList } from '../src/admin/orcamentos/OrcamentoList'
import type { OrcamentoRow } from '../src/admin/orcamentos/orcamento-model'
import type { Banner, Category, Media, Product } from '../src/admin/friendly/model'
import '../src/admin/friendly/mockup.scss'
import '../src/admin/friendly/layout.scss'
import './preview.css'
type Data = { products: Product[]; categories: Category[]; media: Media[]; banners: Banner[]; certifications: number; home: HomeContent; campanhas: CampanhaRow[]; categoriasRows: CategoriaRow[]; cases: CaseRow[]; imprensa: ImprensaRow[]; posts: PostRow[]; depoimentos: DepoimentoRow[]; logos: LogoRow[]; orcamentos: OrcamentoRow[] }
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
 else if (pathname === '/admin/globals/conteudo-home') page = <HomeEditor initial={data.home} />
 else if (pathname === '/admin/collections/campanhas') page = <CampanhaList initial={data.campanhas} />
 else if (parts[1] === 'collections' && parts[2] === 'campanhas' && parts[3]) page = previewCampanha(data.campanhas, parts[3], query.get('copiar'))
 else if (pathname === '/admin/collections/categorias') page = <CategoriaList initial={data.categoriasRows} />
 else if (parts[1] === 'collections' && parts[2] === 'categorias' && parts[3]) page = previewCategoria(data.categoriasRows, parts[3], query.get('copiar'))
 else if (pathname === '/admin/collections/cases') page = <CaseList initial={data.cases} />
 else if (parts[1] === 'collections' && parts[2] === 'cases' && parts[3]) page = previewCase(data.cases, parts[3], query.get('copiar'))
 else if (pathname === '/admin/collections/imprensa') page = <ImprensaList initial={data.imprensa} />
 else if (parts[1] === 'collections' && parts[2] === 'imprensa' && parts[3]) page = previewImprensa(data.imprensa, parts[3], query.get('copiar'))
 else if (pathname === '/admin/collections/posts') page = <PostList initial={data.posts} />
 else if (parts[1] === 'collections' && parts[2] === 'posts' && parts[3]) page = previewPost(data.posts, parts[3], query.get('copiar'))
 else if (pathname === '/admin/collections/depoimentos') page = <DepoimentoList initial={data.depoimentos} />
 else if (parts[1] === 'collections' && parts[2] === 'depoimentos' && parts[3]) page = previewDepoimento(data.depoimentos, parts[3], query.get('copiar'))
 else if (pathname === '/admin/collections/logos') page = <LogoList initial={data.logos} />
 else if (parts[1] === 'collections' && parts[2] === 'logos' && parts[3]) page = previewLogo(data.logos, parts[3], query.get('copiar'))
 else if (pathname === '/admin/collections/media') page = <MidiaList />
 else if (pathname === '/admin/collections/logs-entrega') page = <OrcamentoList initial={data.orcamentos} />
 else if (pathname !== '/admin') page = <div className="bb-admin"><section className="bb-page"><h1>{items.find(item => item.href === pathname)?.label ?? 'Área do painel'}</h1><p>Esta área será adaptada na próxima etapa. O primeiro conjunto contempla Painel, Produtos, Banners, Página inicial e Campanhas.</p><Link href="/admin">Voltar ao painel</Link></section></div>
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

function previewCampanha(campanhas: CampanhaRow[], id: string, copy: string | null) {
 const source = campanhas.find(c => c.id === Number(id === 'create' ? copy : id))
 if (id === 'create') return <CampanhaEditor initial={source ? copyCampanha(source) : newCampanha()} />
 return source ? <CampanhaEditor initial={source} /> : <div className="bb-admin"><section className="bb-page">Campanha não encontrada</section></div>
}

function previewCategoria(categorias: CategoriaRow[], id: string, copy: string | null) {
 const source = categorias.find(c => c.id === Number(id === 'create' ? copy : id))
 if (id === 'create') return <CategoriaEditor initial={source ? copyCategoria(source) : newCategoria()} />
 return source ? <CategoriaEditor initial={source} produtosCount={source.produtosCount} /> : <div className="bb-admin"><section className="bb-page">Categoria não encontrada</section></div>
}

const naoAchou = (nome: string) => <div className="bb-admin"><section className="bb-page">{nome} não encontrado</section></div>
function previewCase(rows: CaseRow[], id: string, copy: string | null) {
 const s = rows.find(c => c.id === Number(id === 'create' ? copy : id))
 if (id === 'create') return <CaseEditor initial={s ? copyCase(s) : newCase()} />
 return s ? <CaseEditor initial={s} /> : naoAchou('Case')
}
function previewImprensa(rows: ImprensaRow[], id: string, copy: string | null) {
 const s = rows.find(c => c.id === Number(id === 'create' ? copy : id))
 if (id === 'create') return <ImprensaEditor initial={s ? copyImprensa(s) : newImprensa()} />
 return s ? <ImprensaEditor initial={s} /> : naoAchou('Materia')
}
function previewPost(rows: PostRow[], id: string, copy: string | null) {
 const s = rows.find(c => c.id === Number(id === 'create' ? copy : id))
 if (id === 'create') return <PostEditor initial={s ? copyPost(s) : newPost()} />
 return s ? <PostEditor initial={s} /> : naoAchou('Artigo')
}
function previewDepoimento(rows: DepoimentoRow[], id: string, copy: string | null) {
 const s = rows.find(c => c.id === Number(id === 'create' ? copy : id))
 if (id === 'create') return <DepoimentoEditor initial={s ? copyDepoimento(s) : newDepoimento()} />
 return s ? <DepoimentoEditor initial={s} /> : naoAchou('Depoimento')
}
function previewLogo(rows: LogoRow[], id: string, _copy: string | null) {
 const s = rows.find(c => c.id === Number(id))
 if (id === 'create') return <LogoEditor initial={newLogo()} />
 return s ? <LogoEditor initial={s} /> : naoAchou('Logo')
}
