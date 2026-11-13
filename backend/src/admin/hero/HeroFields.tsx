'use client'
import React from 'react'
import { HeroImageField } from './HeroImageField'
import { HeroIcon } from './HeroIcon'
import { ICON_OPTIONS, MONTHS, THEME_OPTIONS, type HeroDraft } from './hero-model'
export type HeroFieldProps = { banner: HeroDraft; change: (field: string, value: unknown) => void; disabled?: boolean; errorField?: string }
function text(banner: HeroDraft, field: string) { const value = (banner as unknown as Record<string, unknown>)[field]; return typeof value === 'string' ? value : '' }
export function HeroField({ banner, change, field, label, disabled, errorField, help, hint }: HeroFieldProps & { field: string; label: string; help?: string; hint?: string }) {
  const id = `bb-hero-${field}`
  return <div className="fld"><label htmlFor={id}>{label}{hint ? <span className="opt"> {hint}</span> : null}</label>
    <input className="inp" id={id} aria-invalid={errorField === id} aria-describedby={errorField === id ? 'bb-hero-error' : undefined} value={text(banner, field)} disabled={disabled} onChange={event => change(field, event.target.value)} />
    {help ? <span className="help">{help}</span> : null}</div>
}
export function HeroContentFields({ banner, change, disabled, errorField }: HeroFieldProps) {
  return <>
    <HeroField banner={banner} change={change} disabled={disabled} field="nome" label="Nome do banner" hint="(só aparece aqui no painel)" errorField={errorField} help="Ex.: Janeiro - Volta às aulas." />
    <div className="row2">
      <HeroImageField label="Imagem para computador" help="1656 × 480 px · até 15 MB · sem texto na imagem." value={banner.imagemDesktop} disabled={disabled} onChange={value => change('imagemDesktop', value)} />
      <HeroImageField label="Imagem para celular" help="716 × 480 px · até 15 MB · opcional (sem ela, usa a de computador)." value={banner.imagemMobile} disabled={disabled} onChange={value => change('imagemMobile', value)} />
    </div>
    <HeroField banner={banner} change={change} disabled={disabled} field="tag" label="Etiqueta" errorField={errorField} help="Texto pequeno acima do título (ex.: Carnaval)." />
    <div className="fld"><label htmlFor="bb-hero-icone">Ícone da etiqueta</label><div className="bb-hero-icon-field"><select className="inp" id="bb-hero-icone" value={banner.icone || 'sparkles'} disabled={disabled} onChange={event => change('icone', event.target.value)}>{ICON_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><span className="bb-hero-icon-preview"><HeroIcon name={banner.icone || 'sparkles'} /></span></div></div>
    <div className="fld"><span className="lbl">Título sobre a imagem</span>
      <div className="row3 bb-hero-title">
        <input className="inp" aria-label="Início do título" placeholder="Início" value={text(banner, 'tituloAntes')} disabled={disabled} onChange={event => change('tituloAntes', event.target.value)} />
        <input className="inp bb-hero-title-hl" aria-label="Parte em destaque (verde)" placeholder="Destaque (verde)" value={text(banner, 'tituloDestaque')} disabled={disabled} onChange={event => change('tituloDestaque', event.target.value)} />
        <input className="inp" aria-label="Final do título" placeholder="Final (opcional)" value={text(banner, 'tituloDepois')} disabled={disabled} onChange={event => change('tituloDepois', event.target.value)} />
      </div>
      <span className="help">A parte do meio aparece em verde. O site mantém a última palavra junto, sem quebrar.</span>
    </div>
    <HeroField banner={banner} change={change} disabled={disabled} field="sub" label="Texto de apoio" hint="(opcional)" errorField={errorField} />
    <div className="row2">
      <HeroField banner={banner} change={change} disabled={disabled} field="ctaLabel" label="Texto do botão" errorField={errorField} help="Vazio usa “Ver mais”." />
      <HeroField banner={banner} change={change} disabled={disabled} field="ctaHref" label="Link do botão" errorField={errorField} help="Caminho do site (ex.: /catalogo) ou endereço http(s)." />
    </div>
  </>
}
export function HeroExhibitionFields({ banner, change, disabled, errorField }: HeroFieldProps) {
  const fixo = banner.tipo === 'fixo'
  return <>
    <div className="fld"><span className="lbl">Tipo</span><div className="seg" role="group" aria-label="Tipo do banner">
      <button type="button" className={!fixo ? 'on' : ''} aria-pressed={!fixo} disabled={disabled} onClick={() => change('tipo', 'mensal')}>Mensal (rotaciona)</button>
      <button type="button" className={fixo ? 'on' : ''} aria-pressed={fixo} disabled={disabled} onClick={() => change('tipo', 'fixo')}>Fixo (sempre)</button>
    </div><span className="help">O mês define a prioridade do carrossel, não exclusividade. Fixos aparecem sempre, entre os meses.</span></div>
    {!fixo ? <div className="fld"><label htmlFor="bb-hero-mes">Mês de destaque</label><select className="inp" id="bb-hero-mes" aria-invalid={errorField === 'bb-hero-mes'} value={banner.mes ?? ''} disabled={disabled} onChange={event => change('mes', event.target.value ? Number(event.target.value) : null)}><option value="">Escolha o mês</option>{MONTHS.map((label, index) => <option key={label} value={index + 1}>{label}</option>)}</select></div> : null}
    <div className="row2">
      <div className="fld"><label htmlFor="bb-hero-ordem">Ordem</label><input className="inp" id="bb-hero-ordem" type="number" aria-invalid={errorField === 'bb-hero-ordem'} value={banner.ordem ?? 0} disabled={disabled} onChange={event => change('ordem', event.target.value ? Number(event.target.value) : 0)} /><span className="help">Menor primeiro, desempata dentro de cada grupo.</span></div>
      <div className="fld"><label htmlFor="bb-hero-theme">Tema</label><select className="inp" id="bb-hero-theme" value={banner.theme || 'dark'} disabled={disabled} onChange={event => change('theme', event.target.value)}>{THEME_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
    </div>
    <label className="bb-check bb-hero-ativo"><input type="checkbox" checked={banner.ativo !== false} disabled={disabled} onChange={event => change('ativo', event.target.checked)} />Banner ativo (aparece no site)</label>
  </>
}
