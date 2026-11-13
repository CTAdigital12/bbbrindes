'use client'
import { useUnsavedGuard } from '../friendly/unsaved-guard'
import React, { useEffect, useState } from 'react'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { ConfiguracoesPreview } from './ConfiguracoesPreview'
import { configBody, configSaveIssue, validateConfig, type ConfigIssue } from './configuracoes-data'
import { CONTATO_FIELDS, REDE_FIELDS, type ConfigContent } from './configuracoes-model'
// Editor amigavel do global `configuracoes` (contato, redes, rodape, selos). Molde:
// HomeEditor. Carrega o estado completo, grava com POST /api/globals/configuracoes.
export function ConfiguracoesEditor({ initial, canSave = true }: { initial: ConfigContent; canSave?: boolean }) {
  const [original, setOriginal] = useState<ConfigContent>(initial)
  const [config, setConfig] = useState<ConfigContent>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<ConfigIssue>()
  const [message, setMessage] = useState('')
  const dirty = JSON.stringify(config) !== JSON.stringify(original)
  useUnsavedGuard(dirty)
  const disabled = !canSave || saving
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  const contato = config.contato ?? {}
  const redes = config.redes ?? {}
  const selos = config.selos ?? []
  function clear() { setMessage(''); setError(undefined) }
  function setContato(field: string, value: string) { setConfig(c => ({ ...c, contato: { ...c.contato, [field]: value } })); clear() }
  function setRede(field: string, value: string) { setConfig(c => ({ ...c, redes: { ...c.redes, [field]: value } })); clear() }
  function setDescricao(value: string) { setConfig(c => ({ ...c, descricao: value })); clear() }
  function setSelos(next: { id?: string; nome?: string }[]) { setConfig(c => ({ ...c, selos: next })); clear() }
  function moveSelo(from: number, to: number) { if (to < 0 || to >= selos.length) return; const next = [...selos]; next.splice(to, 0, next.splice(from, 1)[0]); setSelos(next) }
  async function save() {
    const issue = validateConfig(config)
    if (issue) { setError(issue); return }
    setSaving(true); setError(undefined); setMessage('')
    try {
      await requestJSON('/api/globals/configuracoes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(configBody(config)) })
      setOriginal(config)
      setMessage('Configurações salvas. O site pode levar alguns minutos para atualizar.')
    } catch (cause) { setError(configSaveIssue(cause)) } finally { setSaving(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Configurações</h1>{dirty ? <span className="pill-draft">Alterações não salvas</span> : null}<span className="sp" /><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}><Icon name="up" />{saving ? 'Salvando…' : 'Salvar alterações'}</button></div>
    <p className="sub">Dados de contato, redes sociais, texto e selos do rodapé. Nada vai para o site até salvar, e o site reconstrói em alguns minutos.</p>
    {error ? <p id="bb-cfg-error" className="bb-error" role="alert">{error.message}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="prev-wrap"><div>
      <details className="blk" open><summary><Icon name="users" /> Contato<span className="chev">▾</span></summary>
        <div className="in"><p className="sub bb-cfg-hint">Aparecem no rodapé e na página de Contato. O WhatsApp (só números, com DDI) vira o link wa.me.</p>
          <div className="row2">{CONTATO_FIELDS.map(([key, label, ph]) => <div className="fld" key={key}>
            <label htmlFor={`bb-cfg-contato-${key}`}>{label}</label>
            <input className="inp" id={`bb-cfg-contato-${key}`} placeholder={ph} value={contato[key] || ''} disabled={disabled} onChange={e => setContato(key, e.target.value)} />
          </div>)}</div>
        </div>
      </details>
      <details className="blk"><summary><Icon name="midia" /> Redes sociais<span className="chev">▾</span></summary>
        <div className="in"><p className="sub bb-cfg-hint">Cole a URL completa de cada rede. Em branco, o ícone fica escondido no site.</p>
          {REDE_FIELDS.map(([key, label]) => <div className="fld" key={key}>
            <label htmlFor={`bb-cfg-rede-${key}`}>{label}</label>
            <input className="inp" id={`bb-cfg-rede-${key}`} placeholder="https://" value={redes[key] || ''} disabled={disabled} onChange={e => setRede(key, e.target.value)} />
          </div>)}
        </div>
      </details>
      <details className="blk"><summary><Icon name="blog" /> Texto do rodapé<span className="chev">▾</span></summary>
        <div className="in"><p className="sub bb-cfg-hint">Descrição curta da empresa, exibida na primeira coluna do rodapé.</p>
          <div className="fld"><label htmlFor="bb-cfg-descricao">Descrição da empresa</label>
            <textarea id="bb-cfg-descricao" value={config.descricao || ''} disabled={disabled} onChange={e => setDescricao(e.target.value)} />
          </div>
        </div>
      </details>
      <details className="blk"><summary><Icon name="cases" /> Selos / certificações <small>· {selos.length}</small><span className="chev">▾</span></summary>
        <div className="in"><p className="sub bb-cfg-hint">Siglas exibidas na faixa de selos do rodapé (ex.: SGP, GMP, NM300).</p>
          <div className="bb-cfg-selos">{selos.map((s, i) => <div className="bb-cfg-selo" key={i}>
            <input className="inp" aria-label={`Selo ${i + 1}`} placeholder="Ex.: SGP" value={s.nome || ''} disabled={disabled} onChange={e => setSelos(selos.map((it, idx) => idx === i ? { ...it, nome: e.target.value } : it))} />
            <div className="bb-cfg-selo-acts">
              <button type="button" className="lnk" aria-label={`Mover selo ${i + 1} para cima`} disabled={disabled || i === 0} onClick={() => moveSelo(i, i - 1)}>↑</button>
              <button type="button" className="lnk" aria-label={`Mover selo ${i + 1} para baixo`} disabled={disabled || i === selos.length - 1} onClick={() => moveSelo(i, i + 1)}>↓</button>
              <button type="button" className="lnk red" aria-label={`Remover selo ${i + 1}`} disabled={disabled} onClick={() => setSelos(selos.filter((_, idx) => idx !== i))}>Remover</button>
            </div>
          </div>)}</div>
          <button type="button" className="btn sm" disabled={disabled} onClick={() => setSelos([...selos, { nome: '' }])}>+ Adicionar selo</button>
        </div>
      </details>
    </div>
    <div className="prev"><ConfiguracoesPreview config={config} /></div></div>
  </section></div>
}
