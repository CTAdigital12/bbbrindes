'use client'
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { SITE_URL, photo } from '../friendly/model'
import type { InstitucionalContent } from './institucional-model'
// Previa fiel das paginas institucionais. Quem somos: etiqueta, titulo, paragrafos,
// foto da fabrica, faixa de numeros, sustentabilidade (SVG real em
// /img/icones/sustentabilidade-<icone>.svg), certificacoes (a primeira em destaque),
// galeria e linha do tempo. SAC: titulo, texto e os motivos como botoes.
export function InstitucionalPreview({ content }: { content: InstitucionalContent }) {
  const qs = content.quemSomos ?? {}
  const sac = content.sac ?? {}
  const linha = content.linhaDoTempo ?? []
  const numeros = qs.numeros ?? []
  const sustentabilidade = qs.sustentabilidade ?? []
  const selos = qs.selos ?? []
  const galeria = qs.galeria ?? []
  const fotoFabrica = photo(qs.fotoFabrica)?.url
  return <div className="bb-inst-preview">
    <div className="bb-inst-preview-bar"><b>Previa do institucional</b><span className="help">Ilustrativa. Confira o site apos publicar.</span></div>
    <div className="bb-inst-site">
      <div className="bb-inst-site-nav"><img src="/admin-brand/bb-brindes.webp" alt="BB Brindes" /><span>Quem somos</span></div>
      <div className="bb-inst-hero">
        <div className="bb-inst-hero-copy">
          {qs.eyebrow ? <span className="bb-inst-eyebrow">{qs.eyebrow}</span> : null}
          {qs.titulo ? <h5>{qs.titulo}</h5> : null}
          {qs.paragrafo1 ? <p>{qs.paragrafo1}</p> : null}
          {qs.paragrafo2 ? <p>{qs.paragrafo2}</p> : null}
        </div>
        {fotoFabrica ? <img className="bb-inst-hero-img" src={fotoFabrica} alt="" /> : <span className="bb-inst-hero-ph" aria-hidden>Foto da fabrica</span>}
      </div>
      {numeros.length ? <div className="bb-inst-nums">{numeros.map((n, i) => <div className="bb-inst-num" key={i}><b>{n.valor}</b><span>{n.rotulo}</span></div>)}</div> : null}
      {linha.length ? <div className="bb-inst-sec"><span className="bb-inst-sec-ttl">Linha do tempo</span>
        <div className="bb-inst-time">{linha.map((m, i) => <div className={`bb-inst-tm ${m.destaqueResumo ? 'on' : ''}`} key={i}><b>{m.ano}</b><span className="bb-inst-tm-ttl">{m.titulo}</span>{m.destaqueResumo ? <span className="bb-inst-tm-tag">Resumo</span> : null}</div>)}</div>
      </div> : null}
      {sustentabilidade.length ? <div className="bb-inst-sec"><span className="bb-inst-sec-ttl">Sustentabilidade</span>
        <div className="bb-inst-difs">{sustentabilidade.map((s, i) => <div className="bb-inst-dif" key={i}>{s.icone ? <img src={`${SITE_URL}/img/icones/sustentabilidade-${s.icone}.svg`} alt="" /> : null}<b>{s.titulo}</b></div>)}</div>
      </div> : null}
      {selos.length ? <div className="bb-inst-sec"><span className="bb-inst-sec-ttl">Certificacoes</span>
        <div className="bb-inst-selos">{selos.map((s, i) => <div className={`bb-inst-selo ${i === 0 ? 'full' : ''}`} key={i}><i>{s.sigla}</i><b>{s.desc}</b></div>)}</div>
      </div> : null}
      {galeria.length ? <div className="bb-inst-sec"><span className="bb-inst-sec-ttl">Nossa fabrica</span>
        <div className="bb-inst-gal">{galeria.map((g, i) => { const u = photo(g.imagem)?.url; return <figure className="bb-inst-fab" key={i}>{u ? <img src={u} alt="" /> : <span className="bb-inst-fab-ph" aria-hidden>Foto</span>}{g.legenda ? <figcaption>{g.legenda}</figcaption> : null}</figure> })}</div>
      </div> : null}
      <div className="bb-inst-sac">
        <span className="bb-inst-sec-ttl">SAC</span>
        {sac.titulo ? <h5>{sac.titulo}</h5> : null}
        {sac.texto ? <p>{sac.texto}</p> : null}
        {(sac.motivos ?? []).length ? <div className="bb-inst-motivos">{(sac.motivos ?? []).map((m, i) => <span key={i}>{m.texto}</span>)}</div> : null}
      </div>
    </div>
  </div>
}
