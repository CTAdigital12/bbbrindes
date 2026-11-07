'use client'
import React from 'react'
import { HeroImageField } from '../hero/HeroImageField'
import { HomeIcon } from './HomeIcon'
import { DIF_ICON_OPTIONS, SELO_ICON_OPTIONS, type HomeContent, type HomeItem } from './home-model'
export type Change = (field: string, value: unknown) => void
export type BlockProps = { home: HomeContent; change: Change; disabled?: boolean }
// Operacoes de array (atualizar/remover/mover/adicionar) sobre um campo do home.
function arrayOps<T>(items: T[], change: Change, field: string) {
  const set = (next: T[]) => change(field, next)
  return {
    update: (i: number, patch: Partial<T>) => set(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it))),
    remove: (i: number) => set(items.filter((_, idx) => idx !== i)),
    move: (from: number, to: number) => { if (to < 0 || to >= items.length) return; const n = [...items]; n.splice(to, 0, n.splice(from, 1)[0]); set(n) },
    add: (row: T) => set([...items, row]),
  }
}
function RowActions({ i, total, disabled, onMove, onRemove, label }: { i: number; total: number; disabled?: boolean; onMove: (to: number) => void; onRemove: () => void; label: string }) {
  return <div className="bb-home-row-acts">
    <button type="button" className="lnk" aria-label={`Mover ${label} ${i + 1} para cima`} disabled={disabled || i === 0} onClick={() => onMove(i - 1)}>↑</button>
    <button type="button" className="lnk" aria-label={`Mover ${label} ${i + 1} para baixo`} disabled={disabled || i === total - 1} onClick={() => onMove(i + 1)}>↓</button>
    <button type="button" className="lnk red" aria-label={`Remover ${label} ${i + 1}`} disabled={disabled} onClick={onRemove}>Remover</button>
  </div>
}
export function HomeSelosBlock({ home, change, disabled }: BlockProps) {
  const items = home.selosConfianca ?? []
  const ops = arrayOps<HomeItem>(items, change, 'selosConfianca')
  return <details className="blk" open><summary>Selos de confiança <small>· {items.length} itens</small><span className="chev">▾</span></summary>
    <div className="in"><p className="sub bb-home-hint">A faixa logo abaixo do topo. Escolha o ícone, o título e o subtítulo.</p>
      {items.map((s, i) => <div className="bb-home-row" key={i}>
        <div className="bb-home-row-ic"><select className="inp" aria-label={`Ícone do selo ${i + 1}`} value={s.icone || ''} disabled={disabled} onChange={e => ops.update(i, { icone: e.target.value })}><option value="">Ícone…</option>{SELO_ICON_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select><span className="bb-hero-icon-preview"><HomeIcon name={s.icone || ''} /></span></div>
        <input className="inp" aria-label={`Título do selo ${i + 1}`} placeholder="Título" value={s.titulo || ''} disabled={disabled} onChange={e => ops.update(i, { titulo: e.target.value })} />
        <input className="inp" aria-label={`Subtítulo do selo ${i + 1}`} placeholder="Subtítulo" value={s.sub || ''} disabled={disabled} onChange={e => ops.update(i, { sub: e.target.value })} />
        <RowActions i={i} total={items.length} disabled={disabled} onMove={to => ops.move(i, to)} onRemove={() => ops.remove(i)} label="selo" />
      </div>)}
      <button type="button" className="btn sm" disabled={disabled} onClick={() => ops.add({ icone: '', titulo: '', sub: '' })}>+ Adicionar selo</button>
    </div>
  </details>
}
export function HomeDiferenciaisBlock({ home, change, disabled }: BlockProps) {
  const items = home.diferenciais ?? []
  const ops = arrayOps<HomeItem>(items, change, 'diferenciais')
  return <details className="blk"><summary>Por que a BB Brindes (diferenciais) <small>· {items.length} itens</small><span className="chev">▾</span></summary>
    <div className="in"><p className="sub bb-home-hint">Ícone do diferencial usa um arquivo do site (a Joy entrega novos). Título e subtítulo são livres.</p>
      {items.map((d, i) => <div className="bb-home-row" key={i}>
        <select className="inp bb-home-row-sel" aria-label={`Ícone do diferencial ${i + 1}`} value={d.icone || ''} disabled={disabled} onChange={e => ops.update(i, { icone: e.target.value })}><option value="">Ícone…</option>{DIF_ICON_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}</select>
        <input className="inp" aria-label={`Título do diferencial ${i + 1}`} placeholder="Título" value={d.titulo || ''} disabled={disabled} onChange={e => ops.update(i, { titulo: e.target.value })} />
        <input className="inp" aria-label={`Subtítulo do diferencial ${i + 1}`} placeholder="Subtítulo" value={d.sub || ''} disabled={disabled} onChange={e => ops.update(i, { sub: e.target.value })} />
        <RowActions i={i} total={items.length} disabled={disabled} onMove={to => ops.move(i, to)} onRemove={() => ops.remove(i)} label="diferencial" />
      </div>)}
      <button type="button" className="btn sm" disabled={disabled} onClick={() => ops.add({ icone: '', titulo: '', sub: '' })}>+ Adicionar diferencial</button>
    </div>
  </details>
}
function UrgField({ home, change, disabled, field, label, placeholder, area }: BlockProps & { field: string; label: string; placeholder?: string; area?: boolean }) {
  const u = (home.urgencia ?? {}) as Record<string, unknown>
  const value = typeof u[field] === 'string' ? (u[field] as string) : ''
  const set = (v: string) => change('urgencia', { ...home.urgencia, [field]: v })
  const id = `bb-home-urg-${field}`
  return <div className="fld"><label htmlFor={id}>{label}</label>{area
    ? <textarea id={id} value={value} disabled={disabled} onChange={e => set(e.target.value)} />
    : <input className="inp" id={id} placeholder={placeholder} value={value} disabled={disabled} onChange={e => set(e.target.value)} />}</div>
}
export function HomeUrgenciaBlock({ home, change, disabled }: BlockProps) {
  const u = home.urgencia ?? {}
  return <details className="blk"><summary>Bloco de urgência <small>· agenda de fim de ano</small><span className="chev">▾</span></summary>
    <div className="in"><p className="sub bb-home-hint">O contador (countdown) continua automático no site. Aqui você edita a copy e a imagem.</p>
      <div className="row2"><UrgField home={home} change={change} disabled={disabled} field="chip" label="Etiqueta" /><UrgField home={home} change={change} disabled={disabled} field="ctaLabel" label="Texto do botão" /></div>
      <div className="row2"><UrgField home={home} change={change} disabled={disabled} field="tituloInicio" label="Título (início)" /><UrgField home={home} change={change} disabled={disabled} field="tituloDestaque" label="Título em destaque (verde)" /></div>
      <UrgField home={home} change={change} disabled={disabled} field="texto" label="Texto" area />
      <UrgField home={home} change={change} disabled={disabled} field="ctaHref" label="Link do botão" placeholder="/campanha/natal" />
      <HeroImageField label="Imagem do bloco" help="Vazio usa a imagem padrão do site." value={u.imagem} disabled={disabled} onChange={v => change('urgencia', { ...u, imagem: v })} />
    </div>
  </details>
}
// Campo de texto de um grupo qualquer do home (ecoBanner, ecoLead, ...).
function GroupField({ home, change, disabled, group, field, label, area, placeholder }: BlockProps & { group: string; field: string; label: string; area?: boolean; placeholder?: string }) {
  const g = ((home as unknown as Record<string, unknown>)[group] ?? {}) as Record<string, unknown>
  const value = typeof g[field] === 'string' ? (g[field] as string) : ''
  const set = (v: string) => change(group, { ...g, [field]: v })
  const id = `bb-home-${group}-${field}`
  return <div className="fld"><label htmlFor={id}>{label}</label>{area
    ? <textarea id={id} value={value} disabled={disabled} onChange={e => set(e.target.value)} />
    : <input className="inp" id={id} placeholder={placeholder} value={value} disabled={disabled} onChange={e => set(e.target.value)} />}</div>
}
export function HomeEcoBannerBlock({ home, change, disabled }: BlockProps) {
  const g = home.ecoBanner ?? {}
  return <details className="blk"><summary>Banner eco (Linha Green)<span className="chev">▾</span></summary>
    <div className="in"><p className="sub bb-home-hint">Faixa clara com imagem, etiqueta verde, título, texto e botão.</p>
      <div className="row2"><GroupField home={home} change={change} disabled={disabled} group="ecoBanner" field="eyebrow" label="Etiqueta (verde)" /><GroupField home={home} change={change} disabled={disabled} group="ecoBanner" field="ctaLabel" label="Texto do botão" /></div>
      <GroupField home={home} change={change} disabled={disabled} group="ecoBanner" field="titulo" label="Título" />
      <GroupField home={home} change={change} disabled={disabled} group="ecoBanner" field="texto" label="Texto" area />
      <HeroImageField label="Imagem do banner" help="Vazio usa a imagem padrão do site." value={g.imagem} disabled={disabled} onChange={v => change('ecoBanner', { ...g, imagem: v })} />
    </div>
  </details>
}
export function HomeEcoLeadBlock({ home, change, disabled }: BlockProps) {
  const g = home.ecoLead ?? {}
  const linhas = g.linhas ?? []
  const setLinhas = (next: { id?: string; texto?: string }[]) => change('ecoLead', { ...g, linhas: next })
  return <details className="blk"><summary>Bloco eco (destaque escuro) <small>· {linhas.length} linhas</small><span className="chev">▾</span></summary>
    <div className="in"><p className="sub bb-home-hint">Card escuro com etiqueta lime, título, texto, selos/linhas e imagem do produto.</p>
      <div className="row2"><GroupField home={home} change={change} disabled={disabled} group="ecoLead" field="eyebrow" label="Etiqueta (lime)" /><GroupField home={home} change={change} disabled={disabled} group="ecoLead" field="ctaLabel" label="Texto do botão" /></div>
      <GroupField home={home} change={change} disabled={disabled} group="ecoLead" field="titulo" label="Título" />
      <GroupField home={home} change={change} disabled={disabled} group="ecoLead" field="texto" label="Texto" area />
      <div className="fld"><span className="lbl">Selos / linhas</span>
        {linhas.map((l, i) => <div className="bb-home-row bb-home-row-linha" key={i}>
          <input className="inp" aria-label={`Linha ${i + 1}`} placeholder="Ex.: Green Fibras" value={l.texto || ''} disabled={disabled} onChange={e => setLinhas(linhas.map((it, idx) => idx === i ? { ...it, texto: e.target.value } : it))} />
          <RowActions i={i} total={linhas.length} disabled={disabled} onMove={to => { if (to < 0 || to >= linhas.length) return; const n = [...linhas]; n.splice(to, 0, n.splice(i, 1)[0]); setLinhas(n) }} onRemove={() => setLinhas(linhas.filter((_, idx) => idx !== i))} label="linha" />
        </div>)}
        <button type="button" className="btn sm" disabled={disabled} onClick={() => setLinhas([...linhas, { texto: '' }])}>+ Adicionar linha</button>
      </div>
      <HeroImageField label="Imagem do produto" help="Vazio usa a imagem padrão do site." value={g.imagem} disabled={disabled} onChange={v => change('ecoLead', { ...g, imagem: v })} />
    </div>
  </details>
}
export function HomeDepoimentosBlock({ home, change, disabled }: BlockProps) {
  const items = home.depoimentos ?? []
  const ops = arrayOps<{ id?: string; texto?: string; autor?: string }>(items, change, 'depoimentos')
  return <details className="blk"><summary>Depoimentos <small>· {items.length}</small><span className="chev">▾</span></summary>
    <div className="in"><p className="sub bb-home-hint">Frase do cliente e autor (ex.: Nome · Empresa).</p>
      {items.map((q, i) => <div className="bb-home-card" key={i}>
        <textarea aria-label={`Texto do depoimento ${i + 1}`} placeholder="Depoimento do cliente" value={q.texto || ''} disabled={disabled} onChange={e => ops.update(i, { texto: e.target.value })} />
        <div className="bb-home-row-linha"><input className="inp" aria-label={`Autor do depoimento ${i + 1}`} placeholder="Autor · Empresa" value={q.autor || ''} disabled={disabled} onChange={e => ops.update(i, { autor: e.target.value })} /><RowActions i={i} total={items.length} disabled={disabled} onMove={to => ops.move(i, to)} onRemove={() => ops.remove(i)} label="depoimento" /></div>
      </div>)}
      <button type="button" className="btn sm" disabled={disabled} onClick={() => ops.add({ texto: '', autor: '' })}>+ Adicionar depoimento</button>
    </div>
  </details>
}
export function HomeFaqBlock({ home, change, disabled }: BlockProps) {
  const items = home.faq ?? []
  const ops = arrayOps<{ id?: string; pergunta?: string; resposta?: string }>(items, change, 'faq')
  return <details className="blk"><summary>Perguntas frequentes (FAQ) <small>· {items.length}</small><span className="chev">▾</span></summary>
    <div className="in"><p className="sub bb-home-hint">Pergunta e resposta. A primeira aparece aberta no site.</p>
      {items.map((f, i) => <div className="bb-home-card" key={i}>
        <input className="inp" aria-label={`Pergunta ${i + 1}`} placeholder="Pergunta" value={f.pergunta || ''} disabled={disabled} onChange={e => ops.update(i, { pergunta: e.target.value })} />
        <textarea aria-label={`Resposta ${i + 1}`} placeholder="Resposta" value={f.resposta || ''} disabled={disabled} onChange={e => ops.update(i, { resposta: e.target.value })} />
        <div className="bb-home-row-linha"><span className="help">Pergunta {i + 1}</span><RowActions i={i} total={items.length} disabled={disabled} onMove={to => ops.move(i, to)} onRemove={() => ops.remove(i)} label="pergunta" /></div>
      </div>)}
      <button type="button" className="btn sm" disabled={disabled} onClick={() => ops.add({ pergunta: '', resposta: '' })}>+ Adicionar pergunta</button>
    </div>
  </details>
}
export function HomeCtaFinalBlock({ home, change, disabled }: BlockProps) {
  return <details className="blk"><summary>CTA final <small>· chamada de orçamento</small><span className="chev">▾</span></summary>
    <div className="in"><p className="sub bb-home-hint">Bloco escuro no fim da home, com o convite para montar o orçamento.</p>
      <GroupField home={home} change={change} disabled={disabled} group="ctaFinal" field="titulo" label="Título" area />
      <GroupField home={home} change={change} disabled={disabled} group="ctaFinal" field="texto" label="Texto" area />
      <div className="row2"><GroupField home={home} change={change} disabled={disabled} group="ctaFinal" field="ctaLabel" label="Texto do botão" /><GroupField home={home} change={change} disabled={disabled} group="ctaFinal" field="ctaHref" label="Link do botão" placeholder="/catalogo" /></div>
    </div>
  </details>
}
