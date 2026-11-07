"use client"
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { photo, SITE_URL } from '../friendly/model'
import { useDialog } from '../friendly/useDialog'
import { HeroIcon } from './HeroIcon'
import type { HeroDraft } from './hero-model'
const FALLBACK = `${SITE_URL}/img/banners/home-hero-fixo-1-fabrica-propria.webp`
function PreviewSurface({ banner, mobile }: { banner: HeroDraft; mobile: boolean }) {
  const desktop = photo(banner.imagemDesktop)?.url || FALLBACK
  const image = mobile ? photo(banner.imagemMobile)?.url || desktop : desktop
  return <div className={`bb-hero-site ${mobile ? 'bb-hero-mobile' : ''}`}>
    <div className="bb-hero-site-nav"><img src="/admin-brand/bb-brindes.webp" alt="BB Brindes" /><span>Orçamento</span></div>
    <div className={`bb-hero-surface ${banner.theme === 'cream' ? 'bb-hero-cream' : ''}`} style={{ backgroundImage: `url(${JSON.stringify(image)})` }}>
      <div className="bb-hero-copy"><span className="bb-hero-tag"><HeroIcon name={banner.icone || 'sparkles'} />{banner.tag}</span>
        <h3>{banner.tituloAntes} {banner.tituloDestaque ? <mark>{banner.tituloDestaque}</mark> : null} {banner.tituloDepois}</h3>
        {banner.sub ? <p>{banner.sub}</p> : null}
        <div className="bb-hero-ctas"><span className="bb-hero-cta">{banner.ctaLabel || 'Ver mais'}<HeroIcon name="arrow-right" /></span><span className="bb-hero-wa">Falar no WhatsApp</span></div>
      </div>
    </div>
  </div>
}
export function HeroPreview({ banner }: { banner: HeroDraft }) {
  const [mobile, setMobile] = useState(false)
  return <div className="bb-hero-preview"><div className="bb-hero-preview-bar"><b>Prévia</b><span className="sp" /><div className="seg" role="group" aria-label="Dispositivo da prévia"><button type="button" className={!mobile ? 'on' : ''} aria-pressed={!mobile} onClick={() => setMobile(false)}>Computador</button><button type="button" className={mobile ? 'on' : ''} aria-pressed={mobile} onClick={() => setMobile(true)}>Celular</button></div></div>
    <PreviewSurface banner={banner} mobile={mobile} />
    {mobile && !photo(banner.imagemMobile)?.url ? <p className="bb-warning">Sem imagem de celular: o site usa a imagem de computador, recortada.</p> : null}
    {!photo(banner.imagemDesktop)?.url ? <p className="help">Sem imagem de computador, a prévia mostra a imagem padrão atual do site.</p> : null}
    <p className="help">Prévia ilustrativa do conteúdo. Confira a página inicial após salvar e concluir a atualização do site.</p>
  </div>
}
export function HeroPreviewDialog({ banner, onClose }: { banner: HeroDraft; onClose: () => void }) {
  const dialog = useDialog(onClose)
  return <div className="ov"><div ref={dialog} className="modal bb-hero-dialog" role="dialog" aria-modal="true" aria-labelledby="bb-hero-preview-title"><div className="mh"><h2 id="bb-hero-preview-title">Visualizar: {banner.nome}</h2><span className="sp" /><button type="button" className="x-btn" aria-label="Fechar prévia do banner" onClick={onClose}>×</button></div><div className="bb-hero-dialog-body"><HeroPreview banner={banner} /></div></div></div>
}
