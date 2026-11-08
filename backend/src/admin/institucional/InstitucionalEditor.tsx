'use client'
import React, { useEffect, useState } from 'react'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { HeroImageField } from '../hero/HeroImageField'
import { InstitucionalPreview } from './InstitucionalPreview'
import { institucionalBody, institucionalSaveIssue, validateInstitucional } from './institucional-data'
import { SUSTENTABILIDADE_ICON_OPTIONS, type InstGaleria, type InstMarco, type InstMotivo, type InstNumero, type InstQuemSomos, type InstSac, type InstSelo, type InstSustentabilidade, type InstitucionalContent, type InstitucionalIssue } from './institucional-model'
// Operacoes de array (atualizar/remover/mover/adicionar) sobre uma lista.
function arrayOps<T>(items: T[], set: (next: T[]) => void) {
  return {
    update: (i: number, patch: Partial<T>) => set(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it))),
    remove: (i: number) => set(items.filter((_, idx) => idx !== i)),
    move: (from: number, to: number) => { if (to < 0 || to >= items.length) return; const n = [...items]; n.splice(to, 0, n.splice(from, 1)[0]); set(n) },
    add: (row: T) => set([...items, row]),
  }
}
function RowActions({ i, total, disabled, onMove, onRemove, label }: { i: number; total: number; disabled?: boolean; onMove: (to: number) => void; onRemove: () => void; label: string }) {
  return <div className="bb-inst-row-acts">
    <button type="button" className="lnk" aria-label={`Mover ${label} ${i + 1} para cima`} disabled={disabled || i === 0} onClick={() => onMove(i - 1)}>↑</button>
    <button type="button" className="lnk" aria-label={`Mover ${label} ${i + 1} para baixo`} disabled={disabled || i === total - 1} onClick={() => onMove(i + 1)}>↓</button>
    <button type="button" className="lnk red" aria-label={`Remover ${label} ${i + 1}`} disabled={disabled} onClick={onRemove}>Remover</button>
  </div>
}
export function InstitucionalEditor({ initial, canSave = true }: { initial: InstitucionalContent; canSave?: boolean }) {
  const [original, setOriginal] = useState<InstitucionalContent>(initial)
  const [content, setContent] = useState<InstitucionalContent>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<InstitucionalIssue>()
  const [message, setMessage] = useState('')
  const dirty = JSON.stringify(content) !== JSON.stringify(original)
  const disabled = !canSave || saving
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  const qs = content.quemSomos ?? {}
  const sac = content.sac ?? {}
  const linha = content.linhaDoTempo ?? []
  function touched() { setMessage(''); setError(undefined) }
  function setQuemSomos(patch: Partial<InstQuemSomos>) { setContent(c => ({ ...c, quemSomos: { ...c.quemSomos, ...patch } })); touched() }
  function setSac(patch: Partial<InstSac>) { setContent(c => ({ ...c, sac: { ...c.sac, ...patch } })); touched() }
  function setLinha(next: InstMarco[]) { setContent(c => ({ ...c, linhaDoTempo: next })); touched() }
  const numeros = arrayOps<InstNumero>(qs.numeros ?? [], next => setQuemSomos({ numeros: next }))
  const sustent = arrayOps<InstSustentabilidade>(qs.sustentabilidade ?? [], next => setQuemSomos({ sustentabilidade: next }))
  const selos = arrayOps<InstSelo>(qs.selos ?? [], next => setQuemSomos({ selos: next }))
  const galeria = arrayOps<InstGaleria>(qs.galeria ?? [], next => setQuemSomos({ galeria: next }))
  const motivos = arrayOps<InstMotivo>(sac.motivos ?? [], next => setSac({ motivos: next }))
  const marcos = arrayOps<InstMarco>(linha, setLinha)
  async function save() {
    const issue = validateInstitucional(content)
    if (issue) { setError(issue); return }
    setSaving(true); setError(undefined); setMessage('')
    try {
      await requestJSON('/api/globals/conteudo-institucional?depth=1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(institucionalBody(content)) })
      setOriginal(content)
      setMessage('Conteudo institucional salvo. O site pode levar alguns minutos para atualizar.')
    } catch (cause) { setError(institucionalSaveIssue(cause)) } finally { setSaving(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Institucional</h1>{dirty ? <span className="pill-draft">Alteracoes nao salvas</span> : null}<span className="sp" /><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}><Icon name="up" />{saving ? 'Salvando…' : 'Salvar alteracoes'}</button></div>
    <p className="sub">Edite os textos das paginas Quem somos e SAC e a linha do tempo. Nada vai para o site ate salvar, e o site reconstroi em alguns minutos.</p>
    {error ? <p id="bb-inst-error" className="bb-error" role="alert">{error.message}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="prev-wrap"><div>

      <details className="blk" open><summary>Quem somos <small>· topo da pagina</small><span className="chev">▾</span></summary>
        <div className="in"><p className="bb-inst-hint">Etiqueta, titulo, os dois paragrafos de abertura e a foto de destaque da fabrica.</p>
          <div className="row2">
            <div className="fld"><label htmlFor="bb-inst-eyebrow">Etiqueta</label><input className="inp" id="bb-inst-eyebrow" value={qs.eyebrow ?? ''} disabled={disabled} onChange={e => setQuemSomos({ eyebrow: e.target.value })} /></div>
            <div className="fld"><label htmlFor="bb-inst-titulo">Titulo</label><input className="inp" id="bb-inst-titulo" value={qs.titulo ?? ''} disabled={disabled} onChange={e => setQuemSomos({ titulo: e.target.value })} /></div>
          </div>
          <div className="fld"><label htmlFor="bb-inst-p1">Paragrafo 1</label><textarea id="bb-inst-p1" value={qs.paragrafo1 ?? ''} disabled={disabled} onChange={e => setQuemSomos({ paragrafo1: e.target.value })} /></div>
          <div className="fld"><label htmlFor="bb-inst-p2">Paragrafo 2</label><textarea id="bb-inst-p2" value={qs.paragrafo2 ?? ''} disabled={disabled} onChange={e => setQuemSomos({ paragrafo2: e.target.value })} /></div>
          <HeroImageField label="Foto da fabrica" help="Foto de destaque no topo do bloco. Vazio usa a imagem padrao do site." value={qs.fotoFabrica} disabled={disabled} onChange={v => setQuemSomos({ fotoFabrica: v })} />
        </div>
      </details>

      <details className="blk"><summary>Numeros <small>· faixa de 4</small><span className="chev">▾</span></summary>
        <div className="in"><p className="bb-inst-hint">A faixa de destaques (ex.: "27 anos" / "de mercado"). O valor aparece grande e o rotulo embaixo.</p>
          {(qs.numeros ?? []).map((n, i) => <div className="bb-inst-row" key={i}>
            <input className="inp" aria-label={`Valor do numero ${i + 1}`} placeholder="Valor (ex.: 27 anos)" value={n.valor ?? ''} disabled={disabled} onChange={e => numeros.update(i, { valor: e.target.value })} />
            <input className="inp" aria-label={`Rotulo do numero ${i + 1}`} placeholder="Rotulo (ex.: de mercado)" value={n.rotulo ?? ''} disabled={disabled} onChange={e => numeros.update(i, { rotulo: e.target.value })} />
            <RowActions i={i} total={(qs.numeros ?? []).length} disabled={disabled} onMove={to => numeros.move(i, to)} onRemove={() => numeros.remove(i)} label="numero" />
          </div>)}
          <button type="button" className="btn sm" disabled={disabled} onClick={() => numeros.add({ valor: '', rotulo: '' })}>+ Adicionar numero</button>
        </div>
      </details>

      <details className="blk"><summary>Sustentabilidade <small>· {(qs.sustentabilidade ?? []).length} itens</small><span className="chev">▾</span></summary>
        <div className="in"><p className="bb-inst-hint">Icone = slug do arquivo sustentabilidade-&lt;icone&gt;.svg em /img/icones (a Joy entrega novos). Titulo e livre.</p>
          {(qs.sustentabilidade ?? []).map((s, i) => <div className="bb-inst-row" key={i}>
            <input className="inp bb-inst-row-ico" list="bb-inst-sust-icones" aria-label={`Icone do item ${i + 1}`} placeholder="Icone (slug)" value={s.icone ?? ''} disabled={disabled} onChange={e => sustent.update(i, { icone: e.target.value })} />
            <input className="inp" aria-label={`Titulo do item ${i + 1}`} placeholder="Titulo" value={s.titulo ?? ''} disabled={disabled} onChange={e => sustent.update(i, { titulo: e.target.value })} />
            <RowActions i={i} total={(qs.sustentabilidade ?? []).length} disabled={disabled} onMove={to => sustent.move(i, to)} onRemove={() => sustent.remove(i)} label="item" />
          </div>)}
          <datalist id="bb-inst-sust-icones">{SUSTENTABILIDADE_ICON_OPTIONS.map(v => <option key={v} value={v} />)}</datalist>
          <button type="button" className="btn sm" disabled={disabled} onClick={() => sustent.add({ icone: '', titulo: '' })}>+ Adicionar item</button>
        </div>
      </details>

      <details className="blk"><summary>Certificacoes <small>· {(qs.selos ?? []).length} itens</small><span className="chev">▾</span></summary>
        <div className="in"><p className="bb-inst-hint">A primeira ocupa a linha inteira em destaque no site. Sigla (ex.: SMETA 4 Pilares) e descricao curta.</p>
          {(qs.selos ?? []).map((s, i) => <div className="bb-inst-row" key={i}>
            <input className="inp" aria-label={`Sigla da certificacao ${i + 1}`} placeholder="Sigla" value={s.sigla ?? ''} disabled={disabled} onChange={e => selos.update(i, { sigla: e.target.value })} />
            <input className="inp" aria-label={`Descricao da certificacao ${i + 1}`} placeholder="Descricao" value={s.desc ?? ''} disabled={disabled} onChange={e => selos.update(i, { desc: e.target.value })} />
            <RowActions i={i} total={(qs.selos ?? []).length} disabled={disabled} onMove={to => selos.move(i, to)} onRemove={() => selos.remove(i)} label="certificacao" />
          </div>)}
          <button type="button" className="btn sm" disabled={disabled} onClick={() => selos.add({ sigla: '', desc: '' })}>+ Adicionar certificacao</button>
        </div>
      </details>

      <details className="blk"><summary>Galeria de fotos <small>· {(qs.galeria ?? []).length} fotos</small><span className="chev">▾</span></summary>
        <div className="in"><p className="bb-inst-hint">Fotos da fabrica na faixa deslizante. Vazio usa as fotos padrao do site. Cada foto pode ter uma legenda.</p>
          {(qs.galeria ?? []).map((g, i) => <div className="bb-inst-card" key={i}>
            <HeroImageField label={`Foto ${i + 1}`} help="Escolha da biblioteca ou envie uma imagem." value={g.imagem} disabled={disabled} onChange={v => galeria.update(i, { imagem: v })} />
            <div className="bb-inst-row-linha"><input className="inp" aria-label={`Legenda da foto ${i + 1}`} placeholder="Legenda (opcional)" value={g.legenda ?? ''} disabled={disabled} onChange={e => galeria.update(i, { legenda: e.target.value })} /><RowActions i={i} total={(qs.galeria ?? []).length} disabled={disabled} onMove={to => galeria.move(i, to)} onRemove={() => galeria.remove(i)} label="foto" /></div>
          </div>)}
          <button type="button" className="btn sm" disabled={disabled} onClick={() => galeria.add({ imagem: null, legenda: '' })}>+ Adicionar foto</button>
        </div>
      </details>

      <details className="blk"><summary>Linha do tempo <small>· {linha.length} marcos</small><span className="chev">▾</span></summary>
        <div className="in"><p className="bb-inst-hint">Marcos da historia do Grupo BB. Aparece completa no Quem somos; os marcados "Destaque no resumo" entram no teaser da pagina de produto.</p>
          {linha.map((m, i) => <div className="bb-inst-card" key={i}>
            <div className="row2">
              <div className="fld"><label htmlFor={`bb-inst-marco-ano-${i}`}>Ano</label><input className="inp" id={`bb-inst-marco-ano-${i}`} placeholder="Ano" value={m.ano ?? ''} disabled={disabled} onChange={e => marcos.update(i, { ano: e.target.value })} /></div>
              <div className="fld"><label htmlFor={`bb-inst-marco-titulo-${i}`}>Titulo</label><input className="inp" id={`bb-inst-marco-titulo-${i}`} placeholder="Titulo" value={m.titulo ?? ''} disabled={disabled} onChange={e => marcos.update(i, { titulo: e.target.value })} /></div>
            </div>
            <textarea aria-label={`Texto do marco ${i + 1}`} placeholder="Texto do marco" value={m.texto ?? ''} disabled={disabled} onChange={e => marcos.update(i, { texto: e.target.value })} />
            <div className="bb-inst-row-linha"><label className="bb-inst-check"><input type="checkbox" checked={Boolean(m.destaqueResumo)} disabled={disabled} onChange={e => marcos.update(i, { destaqueResumo: e.target.checked })} /> Destaque no resumo (teaser do produto)</label><RowActions i={i} total={linha.length} disabled={disabled} onMove={to => marcos.move(i, to)} onRemove={() => marcos.remove(i)} label="marco" /></div>
          </div>)}
          <button type="button" className="btn sm" disabled={disabled} onClick={() => marcos.add({ ano: '', titulo: '', texto: '', destaqueResumo: false })}>+ Adicionar marco</button>
        </div>
      </details>

      <details className="blk"><summary>SAC <small>· pagina de atendimento</small><span className="chev">▾</span></summary>
        <div className="in"><p className="bb-inst-hint">Titulo, texto de abertura e os motivos de contato que aparecem no formulario.</p>
          <div className="fld"><label htmlFor="bb-inst-sac-titulo">Titulo</label><input className="inp" id="bb-inst-sac-titulo" value={sac.titulo ?? ''} disabled={disabled} onChange={e => setSac({ titulo: e.target.value })} /></div>
          <div className="fld"><label htmlFor="bb-inst-sac-texto">Texto</label><textarea id="bb-inst-sac-texto" value={sac.texto ?? ''} disabled={disabled} onChange={e => setSac({ texto: e.target.value })} /></div>
          <div className="fld"><span className="lbl">Motivos de contato</span>
            {(sac.motivos ?? []).map((m, i) => <div className="bb-inst-row-linha" key={i}>
              <input className="inp" aria-label={`Motivo ${i + 1}`} placeholder="Motivo de contato" value={m.texto ?? ''} disabled={disabled} onChange={e => motivos.update(i, { texto: e.target.value })} />
              <RowActions i={i} total={(sac.motivos ?? []).length} disabled={disabled} onMove={to => motivos.move(i, to)} onRemove={() => motivos.remove(i)} label="motivo" />
            </div>)}
            <button type="button" className="btn sm" disabled={disabled} onClick={() => motivos.add({ texto: '' })}>+ Adicionar motivo</button>
          </div>
        </div>
      </details>

    </div>
    <div className="prev"><InstitucionalPreview content={content} /></div></div>
  </section></div>
}
