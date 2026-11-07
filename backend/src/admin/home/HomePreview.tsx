'use client'
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { SITE_URL, photo } from '../friendly/model'
import { HomeIcon } from './HomeIcon'
import type { HomeContent } from './home-model'
// Previa fiel dos blocos da home (Parte 1: faixa de confianca, diferenciais e
// bloco de urgencia). Selos usam o icone por nome; diferenciais usam o SVG real
// publicado no site (/img/icones/diferencial-<slug>.svg). Blocos das proximas
// partes (eco, depoimentos, FAQ, CTA) entram aqui depois.
export function HomePreview({ home }: { home: HomeContent }) {
  const selos = home.selosConfianca ?? []
  const difs = home.diferenciais ?? []
  const urg = home.urgencia ?? {}
  const urgImg = photo(urg.imagem)?.url
  const eb = home.ecoBanner ?? {}
  const ebImg = photo(eb.imagem)?.url
  const el = home.ecoLead ?? {}
  const elImg = photo(el.imagem)?.url
  const deps = home.depoimentos ?? []
  const faqs = home.faq ?? []
  const cta = home.ctaFinal ?? {}
  return <div className="bb-home-preview">
    <div className="bb-home-preview-bar"><b>Prévia da home</b><span className="help">Ilustrativa. Confira o site após publicar.</span></div>
    <div className="bb-home-site">
      <div className="bb-home-site-nav"><img src="/admin-brand/bb-brindes.webp" alt="BB Brindes" /><span>Orçamento</span></div>
      <div className="bb-home-trust">{selos.map((s, i) => <div className="bb-home-titem" key={i}><span className="bb-home-ib"><HomeIcon name={s.icone || ''} /></span><div><b>{s.titulo}</b><span>{s.sub}</span></div></div>)}</div>
      <div className="bb-home-sec"><span className="bb-home-sec-ttl">Por que a BB Brindes</span>
        <div className="bb-home-difs">{difs.map((d, i) => <div className="bb-home-dif" key={i}>{d.icone ? <img src={`${SITE_URL}/img/icones/diferencial-${d.icone}.svg`} alt="" /> : null}<b>{d.titulo}</b><span>{d.sub}</span></div>)}</div>
      </div>
      <div className="bb-home-urg">
        <div className="bb-home-urg-copy">
          {urg.chip ? <span className="bb-home-chip">{urg.chip}</span> : null}
          <h5>{urg.tituloInicio} {urg.tituloDestaque ? <em>{urg.tituloDestaque}</em> : null}</h5>
          {urg.texto ? <p>{urg.texto}</p> : null}
          {urg.ctaLabel ? <span className="bb-home-cta">{urg.ctaLabel}</span> : null}
        </div>
        {urgImg ? <img className="bb-home-urg-img" src={urgImg} alt="" /> : null}
      </div>
      <div className="bb-home-ecob">
        {ebImg ? <img className="bb-home-ecob-img" src={ebImg} alt="" /> : null}
        <div className="bb-home-ecob-copy">
          {eb.eyebrow ? <span className="bb-home-eyebrow green">{eb.eyebrow}</span> : null}
          {eb.titulo ? <h5>{eb.titulo}</h5> : null}
          {eb.texto ? <p>{eb.texto}</p> : null}
          {eb.ctaLabel ? <span className="bb-home-cta deep">{eb.ctaLabel}</span> : null}
        </div>
      </div>
      <div className="bb-home-ecol">
        <div className="bb-home-ecol-copy">
          {el.eyebrow ? <span className="bb-home-eyebrow lime">{el.eyebrow}</span> : null}
          {el.titulo ? <h5>{el.titulo}</h5> : null}
          {el.texto ? <p>{el.texto}</p> : null}
          {(el.linhas ?? []).length ? <div className="bb-home-lines">{(el.linhas ?? []).map((l, i) => <span key={i}>{l.texto}</span>)}</div> : null}
          {el.ctaLabel ? <span className="bb-home-cta lime">{el.ctaLabel}</span> : null}
        </div>
        {elImg ? <img className="bb-home-ecol-img" src={elImg} alt="" /> : null}
      </div>
      <div className="bb-home-sec"><span className="bb-home-sec-ttl">Depoimentos</span>
        <div className="bb-home-quotes">{deps.map((q, i) => <div className="bb-home-qt" key={i}><span className="bb-home-qmark">“</span><p>{q.texto}</p><span className="bb-home-qa">{q.autor}</span></div>)}</div>
      </div>
      <div className="bb-home-sec"><span className="bb-home-sec-ttl">Dúvidas frequentes</span>
        <div className="bb-home-faq">{faqs.map((f, i) => <div className="bb-home-q" key={i}><b>{f.pergunta}</b><span>{f.resposta}</span></div>)}</div>
      </div>
      <div className="bb-home-ctaf">
        {cta.titulo ? <h5>{cta.titulo}</h5> : null}
        {cta.texto ? <p>{cta.texto}</p> : null}
        {cta.ctaLabel ? <span className="bb-home-cta lime">{cta.ctaLabel}</span> : null}
      </div>
    </div>
  </div>
}
