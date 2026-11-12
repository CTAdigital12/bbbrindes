/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'
import { Icon } from './icons'
import { dateLabel } from './model'
import type { DashboardData } from './dashboard-data'

export function Dashboard({ data, name, greeting }: { data: DashboardData; name: string; greeting: string }) {
  const alerts = [
    { count: data.withoutPhoto, tone: 'e', title: 'Produtos sem foto', text: 'Revise as imagens que aparecem no catálogo.', action: 'Ver produtos', href: '/admin/collections/produtos?f=semfoto' },
    { count: data.productsWithMissingColorPhoto, tone: 'w', title: 'Produtos com cor sem foto', text: 'Produtos onde alguma cor ainda não tem a imagem dela.', action: 'Resolver', href: '/admin/produtos-cor-sem-foto' },
    { count: data.bannersWithoutMobile, tone: 'w', title: 'Banners ativos sem versão para celular', text: 'Confira as versões para computador e celular.', action: 'Ver banners', href: '/admin/collections/hero-slides' },
    { count: data.certifications, tone: 'i', title: 'Certificações cadastradas', text: 'Revise as informações exibidas no site.', action: 'Revisar', href: '/admin/globals/configuracoes' },
    { count: data.unpublished, tone: 'i', title: 'Produtos não publicados', text: 'Itens com a opção Publicar no site desmarcada.', action: 'Abrir', href: '/admin/collections/produtos?f=naopublicado' },
  ]
  const shortcuts = [
    ['prod', 'Novo produto', 'Nome, fotos, cores e selos numa tela só', '/admin/collections/produtos/create'],
    ['banner', 'Trocar banner do mês', 'Editar as imagens e os destaques da home', '/admin/collections/hero-slides'],
    ['home', 'Editar página inicial', 'Textos e destaques da página inicial', '/admin/globals/conteudo-home'],
    ['midia', 'Abrir a Mídia', `${data.mediaCount} imagens na biblioteca`, '/admin/collections/media'],
  ]
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Painel</h1></div><p className="sub">{greeting}, {name}. O que você quer fazer hoje?</p>
    <div className="dash">{shortcuts.map(([icon, title, text, href]) => <Link className="qa" href={href} key={href}><span className="ic"><Icon name={icon} /></span><b>{title}</b><span>{text}</span></Link>)}</div>
    <div className="dcols">
      <div className="bb-card"><div className="hd">Precisa de atenção</div><div className="bd">{alerts.map(alert => <div className="alert" key={alert.title}>
        <span className={`dot ${alert.tone}`}>{alert.count}</span><div className="tx">{alert.title}<span>{alert.text}</span></div><Link className="btn sm ghost" href={alert.href}>{alert.action}</Link>
      </div>)}</div></div>
      <div className="bb-stack"><div className="bb-card"><div className="hd">No ar agora na página inicial<span className="sp" /><Link className="lnk" href="/admin/collections/hero-slides">Gerenciar</Link></div>
        <div className="bd"><div className="live">{data.highlights.map(banner => <figure key={banner.id}>
          {banner.image ? <img src={banner.image} alt={banner.name} /> : <div className="nofoto">Sem imagem</div>}<figcaption>{banner.name} · {banner.period}</figcaption>
        </figure>)}</div><p className="help bb-small">Primeiros destaques do carrossel.</p></div></div>
        <div className="bb-card"><div className="hd">Atualizações recentes</div><div className="bd act">{data.activity.map(item => <div key={item.href}><time title={dateLabel(item.date)}>{dateLabel(item.date).slice(0, 5)}</time><Link href={item.href}>{item.title}</Link></div>)}</div></div>
      </div>
    </div>
  </section></div>
}
