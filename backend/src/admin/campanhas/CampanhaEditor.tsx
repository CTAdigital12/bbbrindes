'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { HeroImageField } from '../hero/HeroImageField'
import { plainText, richText } from '../friendly/product-data'
import { campanhaBody, campSaveIssue, campStatus, validateCampanha } from './campanha-data'
import { CAMPANHA_PATH, MES_OPTIONS, type CampanhaDraft, type CampanhaIssue } from './campanha-model'
import { CampanhaPreview } from './CampanhaPreview'
import { ProductPicker } from './ProductPicker'
import type { Product } from '../friendly/model'
function selectedProducts(c: CampanhaDraft): Product[] {
  return (c.produtos ?? []).filter((p): p is Product => typeof p === 'object')
}
export function CampanhaEditor({ initial, canSave = true }: { initial: CampanhaDraft; canSave?: boolean }) {
  const router = useRouter()
  const [original, setOriginal] = useState<CampanhaDraft>(initial)
  const [campanha, setCampanha] = useState<CampanhaDraft>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<CampanhaIssue>()
  const [message, setMessage] = useState('')
  const [picker, setPicker] = useState(false)
  const dirty = JSON.stringify(campanha) !== JSON.stringify(original)
  const disabled = !canSave || saving
  const [statusKey, statusLabel] = campStatus(campanha)
  const produtos = selectedProducts(campanha)
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
  function change(field: string, value: unknown) { setCampanha(current => ({ ...current, [field]: value })); setMessage(''); setError(undefined) }
  async function save() {
    const issue = validateCampanha(campanha)
    if (issue) { setError({ ...issue }); return }
    setSaving(true); setError(undefined); setMessage('')
    try {
      const body = campanhaBody(campanha, original.id ? original : undefined)
      if (!Object.keys(body).length) { setMessage('Nenhuma alteração para salvar.'); return }
      const result = await requestJSON<{ doc: CampanhaDraft }>(`/api/campanhas${original.id ? `/${original.id}` : ''}?depth=1`, { method: original.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      setCampanha(result.doc); setOriginal(result.doc)
      setMessage('Campanha salva. O site pode levar alguns minutos para atualizar.')
      if (!original.id && result.doc.id) router.push(`${CAMPANHA_PATH}/${result.doc.id}`)
    } catch (cause) { setError(campSaveIssue(cause)) } finally { setSaving(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>{original.id ? 'Editar campanha' : 'Adicionar campanha'}</h1>{original.id ? <Link className="btn" href={`${CAMPANHA_PATH}/create`}><Icon name="plus" />Adicionar campanha</Link> : null}<span className="sp" /><Link className="lnk" href={CAMPANHA_PATH}>Voltar para Campanhas</Link></div>
    {error ? <p id="bb-camp-error" className="bb-error" role="alert">{error.message}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="prev-wrap"><div className="bb-stack">
      <div className="bb-card"><div className="bd">
        <input id="bb-camp-nome" className="ttl" aria-label="Nome da campanha" aria-invalid={error?.field === 'bb-camp-nome'} placeholder="Nome da campanha" value={campanha.nome} disabled={disabled} onChange={e => change('nome', e.target.value)} />
        <div className="row2" style={{ marginTop: 12 }}>
          <div className="fld"><label htmlFor="bb-camp-mes">Mês / período</label><input className="inp" id="bb-camp-mes" list="bb-camp-meses" placeholder="Ex.: Maio" value={campanha.mes || ''} disabled={disabled} onChange={e => change('mes', e.target.value)} /><datalist id="bb-camp-meses">{MES_OPTIONS.map(m => <option key={m} value={m} />)}</datalist></div>
          <div className="fld"><label htmlFor="bb-camp-chamada">Chamada / subtítulo</label><input className="inp" id="bb-camp-chamada" value={campanha.chamada || ''} disabled={disabled} onChange={e => change('chamada', e.target.value)} /></div>
        </div>
        <HeroImageField label="Imagem da campanha" help="Aparece no card da home e no topo da página. Vazio usa um fundo verde." value={campanha.imagem} disabled={disabled} onChange={v => change('imagem', v)} />
        <div className="fld"><label htmlFor="bb-camp-conteudo">Texto da página</label><textarea id="bb-camp-conteudo" rows={6} value={plainText(campanha.conteudo)} disabled={disabled} onChange={e => change('conteudo', richText(e.target.value))} /></div>
        <div className="fld"><span className="lbl">Produtos em destaque <span className="opt">({produtos.length})</span></span>{produtos.length ? <div className="bb-camp-chips">{produtos.map(p => <span className="bb-camp-chip" key={p.id}>{p.nome}<button type="button" aria-label={`Remover ${p.nome}`} disabled={disabled} onClick={() => change('produtos', produtos.filter(x => x.id !== p.id))}>×</button></span>)}</div> : <span className="help">Nenhum produto selecionado.</span>}<button type="button" className="btn sm" disabled={disabled} onClick={() => setPicker(true)}>Gerenciar produtos</button><span className="help">Produtos exibidos na página da campanha.</span></div>
        <label className="bb-check bb-hero-ativo"><input type="checkbox" checked={campanha.ativo !== false} disabled={disabled} onChange={e => change('ativo', e.target.checked)} />Campanha ativa (aparece no site)</label>
      </div><div className="pub"><div className="line bb-hero-situacao" style={{ padding: '0 16px 12px' }}>Situação: <span className={`st ${statusKey}`}>{statusLabel}</span>{dirty ? <span className="bb-warning">Alterações ainda não salvas</span> : null}</div><div className="foot"><Link className="lnk" href={CAMPANHA_PATH}>Cancelar</Link><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}>{saving ? 'Salvando…' : 'Salvar campanha'}</button></div></div></div>
    </div>
    <div className="prev"><CampanhaPreview campanha={campanha} /></div></div>
    {picker ? <ProductPicker initial={produtos} onApply={list => change('produtos', list)} onClose={() => setPicker(false)} /> : null}
  </section></div>
}
