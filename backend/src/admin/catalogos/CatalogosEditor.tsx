'use client'
import React, { useEffect, useState } from 'react'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { CatalogosPreview } from './CatalogosPreview'
import { catalogosBody, catalogosSaveIssue, validateCatalogos, type CatalogoIssue } from './catalogos-data'
import type { CatalogoContent, CatalogoItem } from './catalogos-model'
// Editor amigavel do global `catalogos` (pagina /catalogos): titulo/intro, a URL do
// flipbook (heyzine) e os cards de atalho. Molde: HomeEditor. Grava com POST
// /api/globals/catalogos.
export function CatalogosEditor({ initial, canSave = true }: { initial: CatalogoContent; canSave?: boolean }) {
  const [original, setOriginal] = useState<CatalogoContent>(initial)
  const [cat, setCat] = useState<CatalogoContent>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<CatalogoIssue>()
  const [message, setMessage] = useState('')
  const dirty = JSON.stringify(cat) !== JSON.stringify(original)
  const disabled = !canSave || saving
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  const itens = cat.itens ?? []
  function clear() { setMessage(''); setError(undefined) }
  function set(field: string, value: unknown) { setCat(c => ({ ...c, [field]: value })); clear() }
  function setItens(next: CatalogoItem[]) { set('itens', next) }
  function updateItem(i: number, patch: Partial<CatalogoItem>) { setItens(itens.map((it, idx) => idx === i ? { ...it, ...patch } : it)) }
  function moveItem(from: number, to: number) { if (to < 0 || to >= itens.length) return; const n = [...itens]; n.splice(to, 0, n.splice(from, 1)[0]); setItens(n) }
  async function save() {
    const issue = validateCatalogos(cat)
    if (issue) { setError(issue); return }
    setSaving(true); setError(undefined); setMessage('')
    try {
      await requestJSON('/api/globals/catalogos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(catalogosBody(cat)) })
      setOriginal(cat)
      setMessage('Catálogo digital salvo. O site pode levar alguns minutos para atualizar.')
    } catch (cause) { setError(catalogosSaveIssue(cause)) } finally { setSaving(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Catálogo digital</h1>{dirty ? <span className="pill-draft">Alterações não salvas</span> : null}<span className="sp" /><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}><Icon name="up" />{saving ? 'Salvando…' : 'Salvar alterações'}</button></div>
    <p className="sub">Página /catálogos: título, chamada, o flipbook (heyzine) e os cards de atalho. Nada vai para o site até salvar, e o site reconstrói em alguns minutos.</p>
    {error ? <p id="bb-cat-dig-error" className="bb-error" role="alert">{error.message}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="prev-wrap"><div>
      <details className="blk" open><summary><Icon name="cat" /> Página<span className="chev">▾</span></summary>
        <div className="in"><p className="sub bb-cat-dig-hint">O flipbook é o embed do heyzine (ex.: https://heyzine.com/flip-book/&lt;id&gt;.html).</p>
          <div className="fld"><label htmlFor="bb-cat-dig-titulo">Título</label>
            <input className="inp" id="bb-cat-dig-titulo" placeholder="Catálogo digital" value={cat.titulo || ''} disabled={disabled} onChange={e => set('titulo', e.target.value)} />
          </div>
          <div className="fld"><label htmlFor="bb-cat-dig-intro">Chamada (intro)</label>
            <textarea id="bb-cat-dig-intro" value={cat.intro || ''} disabled={disabled} onChange={e => set('intro', e.target.value)} />
          </div>
          <div className="fld"><label htmlFor="bb-cat-dig-flip">URL do flipbook (heyzine)</label>
            <input className="inp" id="bb-cat-dig-flip" placeholder="https://heyzine.com/flip-book/..." value={cat.flipbookUrl || ''} disabled={disabled} onChange={e => set('flipbookUrl', e.target.value)} />
          </div>
        </div>
      </details>
      <details className="blk" open><summary><Icon name="list" /> Cards de catálogo <small>· {itens.length}</small><span className="chev">▾</span></summary>
        <div className="in"><p className="sub bb-cat-dig-hint">Atalhos abaixo do flipbook. Link vazio abre o flipbook principal da página.</p>
          {itens.map((it, i) => <div className="bb-cat-dig-card" key={i}>
            <input className="inp" aria-label={`Nome do card ${i + 1}`} placeholder="Ex.: Catálogo BB Brindes 2027" value={it.nome || ''} disabled={disabled} onChange={e => updateItem(i, { nome: e.target.value })} />
            <input className="inp" aria-label={`Link do card ${i + 1}`} placeholder="Link próprio (opcional)" value={it.url || ''} disabled={disabled} onChange={e => updateItem(i, { url: e.target.value })} />
            <div className="bb-cat-dig-card-acts">
              <button type="button" className="lnk" aria-label={`Mover card ${i + 1} para cima`} disabled={disabled || i === 0} onClick={() => moveItem(i, i - 1)}>↑</button>
              <button type="button" className="lnk" aria-label={`Mover card ${i + 1} para baixo`} disabled={disabled || i === itens.length - 1} onClick={() => moveItem(i, i + 1)}>↓</button>
              <button type="button" className="lnk red" aria-label={`Remover card ${i + 1}`} disabled={disabled} onClick={() => setItens(itens.filter((_, idx) => idx !== i))}>Remover</button>
            </div>
          </div>)}
          <button type="button" className="btn sm" disabled={disabled} onClick={() => setItens([...itens, { nome: '', url: '' }])}>+ Adicionar card</button>
        </div>
      </details>
    </div>
    <div className="prev"><CatalogosPreview cat={cat} /></div></div>
  </section></div>
}
