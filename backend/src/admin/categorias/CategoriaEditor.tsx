'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { HeroImageField } from '../hero/HeroImageField'
import { categoriaBody, catSaveIssue, conflitoOrdem, ordemFim, resolverSubstituir, validateCategoria } from './categoria-data'
import type { OrdemChange, OrdemSibling } from './categoria-data'
import { CATEGORIA_PATH, GRUPO_OPTIONS, type CategoriaDraft, type CategoriaIssue, type GrupoCategoria } from './categoria-model'
import { CategoriaPreview } from './CategoriaPreview'
export function CategoriaEditor({ initial, canSave = true, produtosCount }: { initial: CategoriaDraft; canSave?: boolean; produtosCount?: number }) {
  const router = useRouter()
  const [original, setOriginal] = useState<CategoriaDraft>(initial)
  const [categoria, setCategoria] = useState<CategoriaDraft>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<CategoriaIssue>()
  const [message, setMessage] = useState('')
  // Item K: outras categorias (pra detectar/resolver conflito de ordem) + reordenacao
  // pendente dos vizinhos (aplicada no salvar).
  const [siblings, setSiblings] = useState<OrdemSibling[]>([])
  const [pendingReorder, setPendingReorder] = useState<OrdemChange[]>([])
  const dirty = JSON.stringify(categoria) !== JSON.stringify(original)
  const disabled = !canSave || saving
  const ordemAtual = Number(categoria.ordem ?? 0)
  const ordemMudou = (categoria.ordem ?? 0) !== (original.ordem ?? 0)
  const conflito = ordemMudou ? conflitoOrdem(siblings, ordemAtual, original.id) : undefined
  useEffect(() => {
    let alive = true
    requestJSON<{ docs: OrdemSibling[] }>(`/api/categorias?limit=200&depth=0&sort=ordem`)
      .then(result => { if (alive) setSiblings(result.docs) })
      .catch(() => { /* conflito e so um aviso; sem a lista, o editor segue normal */ })
    return () => { alive = false }
  }, [])
  function substituirOrdem() {
    const self: OrdemSibling = { id: original.id, nome: categoria.nome || 'esta categoria', grupo: categoria.grupo, ordem: categoria.ordem }
    const resultado = resolverSubstituir(siblings, self, categoria.grupo, ordemAtual)
    setPendingReorder(resultado.changes)
    setCategoria(current => ({ ...current, ordem: resultado.ordem }))
    setMessage(''); setError(undefined)
  }
  function mandarProFim() {
    setPendingReorder([])
    setCategoria(current => ({ ...current, ordem: ordemFim(siblings, original.id) }))
    setMessage(''); setError(undefined)
  }
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  useEffect(() => {
    if (!error?.field) return
    const field = document.getElementById(error.field); field?.focus(); field?.scrollIntoView({ block: 'center' })
  }, [error])
  function change(field: string, value: unknown) { setCategoria(current => ({ ...current, [field]: value })); setMessage(''); setError(undefined) }
  async function save() {
    const issue = validateCategoria(categoria)
    if (issue) { setError({ ...issue }); return }
    setSaving(true); setError(undefined); setMessage('')
    try {
      const body = categoriaBody(categoria, original.id ? original : undefined)
      if (!Object.keys(body).length) { setMessage('Nenhuma alteração para salvar.'); return }
      const result = await requestJSON<{ doc: CategoriaDraft }>(`/api/categorias${original.id ? `/${original.id}` : ''}?depth=1`, { method: original.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      // Item K: aplica a reordenacao dos vizinhos escolhida em "Colocar aqui e reorganizar".
      if (pendingReorder.length) {
        for (const change of pendingReorder) {
          await requestJSON(`/api/categorias/${change.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ordem: change.ordem }) })
        }
        setPendingReorder([])
      }
      setCategoria(result.doc); setOriginal(result.doc)
      setMessage('Categoria salva. O site pode levar alguns minutos para atualizar.')
      if (!original.id && result.doc.id) router.push(`${CATEGORIA_PATH}/${result.doc.id}`)
    } catch (cause) { setError(catSaveIssue(cause)) } finally { setSaving(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>{original.id ? 'Editar categoria' : 'Adicionar categoria'}</h1>{original.id ? <Link className="btn" href={`${CATEGORIA_PATH}/create`}><Icon name="plus" />Adicionar categoria</Link> : null}<span className="sp" /><Link className="lnk" href={CATEGORIA_PATH}>Voltar para Categorias</Link></div>
    {error ? <p id="bb-cat-error" className="bb-error" role="alert">{error.message}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="prev-wrap"><div className="bb-stack">
      <div className="bb-card"><div className="bd">
        <input id="bb-cat-nome" className="ttl" aria-label="Nome da categoria" aria-invalid={error?.field === 'bb-cat-nome'} placeholder="Nome da categoria" value={categoria.nome} disabled={disabled} onChange={e => change('nome', e.target.value)} />
        <div className="row2" style={{ marginTop: 12 }}>
          <div className="fld"><label htmlFor="bb-cat-grupo">Grupo</label><select className="inp" id="bb-cat-grupo" value={categoria.grupo || 'geral'} disabled={disabled} onChange={e => change('grupo', e.target.value as GrupoCategoria)}>{GRUPO_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select><span className="help">Ecológicos ficam agrupados no topo da grade.</span></div>
          <div className="fld"><label htmlFor="bb-cat-ordem">Ordem</label><input className="inp" id="bb-cat-ordem" type="number" value={categoria.ordem ?? 0} disabled={disabled} onChange={e => { setPendingReorder([]); change('ordem', e.target.value === '' ? 0 : Number(e.target.value)) }} /><span className="help">Menor aparece primeiro, dentro do grupo. Dica: arraste as categorias na lista para ordenar sem se preocupar com o número.</span></div>
        </div>
        {conflito ? <div className="fld" style={{ border: '1px solid #e0b64d', background: '#fff8e6', borderRadius: 8, padding: '10px 12px' }}>
          <span className="lbl">Conflito de ordem</span>
          <span className="help">A ordem {ordemAtual} já é usada por “{conflito.nome}”. No site, duas categorias com a mesma ordem podem fazer esta cair para o fim da fila. O que você quer?</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            <button type="button" className="btn sm" disabled={disabled} onClick={substituirOrdem}>Colocar aqui e reorganizar o resto</button>
            <button type="button" className="btn sm ghost" disabled={disabled} onClick={mandarProFim}>Mandar pro fim</button>
          </div>
          {pendingReorder.length ? <span className="help" style={{ marginTop: 6 }}>Ao salvar, {pendingReorder.length} categoria(s) serão renumeradas para manter a ordem certinha.</span> : null}
        </div> : null}
        <HeroImageField label="Ícone da categoria" help="Aparece na grade da home (estilo iFood). Use um ícone quadrado; vazio mostra a inicial do nome." value={categoria.icone} disabled={disabled} onChange={v => change('icone', v)} />
      </div><div className="pub"><div className="line" style={{ padding: '0 16px 12px' }}>{dirty ? <span className="bb-warning">Alterações ainda não salvas</span> : <span className="help">Tudo salvo.</span>}</div><div className="foot"><Link className="lnk" href={CATEGORIA_PATH}>Cancelar</Link><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}>{saving ? 'Salvando…' : 'Salvar categoria'}</button></div></div></div>
    </div>
    <div className="prev"><CategoriaPreview categoria={categoria} produtosCount={produtosCount} /></div></div>
  </section></div>
}
