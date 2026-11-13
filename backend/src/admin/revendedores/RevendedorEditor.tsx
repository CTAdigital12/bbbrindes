'use client'
import { useUnsavedGuard } from '../friendly/unsaved-guard'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { revendedorBody, revSaveIssue, revStatus, validateRevendedor } from './revendedores-data'
import { NIVEL_OPTIONS, REVENDEDOR_PATH, type NivelRevendedor, type RevendedorDraft, type RevendedorIssue } from './revendedores-model'
import { RevendedorPreview } from './RevendedorPreview'

export function RevendedorEditor({ initial, canSave = true }: { initial: RevendedorDraft; canSave?: boolean }) {
  const router = useRouter()
  const [original, setOriginal] = useState<RevendedorDraft>(initial)
  const [revendedor, setRevendedor] = useState<RevendedorDraft>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<RevendedorIssue>()
  const [message, setMessage] = useState('')
  const isCreate = !original.id
  const dirty = JSON.stringify(revendedor) !== JSON.stringify(original)
  useUnsavedGuard(dirty)
  const disabled = !canSave || saving
  const [statusKey, statusLabel] = revStatus(revendedor)
  const needsNivel = revendedor.ativo === true && !revendedor.nivel
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
  function change(field: string, value: unknown) { setRevendedor(current => ({ ...current, [field]: value })); setMessage(''); setError(undefined) }
  function changeEndereco(sub: string, value: string) {
    setRevendedor(current => ({ ...current, enderecoEntrega: { ...current.enderecoEntrega, [sub]: value } })); setMessage(''); setError(undefined)
  }
  async function save() {
    // Validacao do cliente primeiro: espelha o servidor, inclusive ativo-exige-nivel.
    const issue = validateRevendedor(revendedor, { isCreate })
    if (issue) { setError({ ...issue }); return }
    if (!isCreate && !dirty) { setMessage('Nenhuma alteração para salvar.'); return }
    setSaving(true); setError(undefined); setMessage('')
    try {
      const body = revendedorBody(revendedor, isCreate ? undefined : original)
      const result = await requestJSON<{ doc: RevendedorDraft }>(`/api/revendedores${isCreate ? '' : `/${original.id}`}?depth=0`, { method: isCreate ? 'POST' : 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      // A API nunca devolve a senha: zera o campo para o proximo save nao reenviar.
      const saved: RevendedorDraft = { ...result.doc, password: '' }
      setRevendedor(saved); setOriginal(saved)
      setMessage('Revendedor salvo.')
      if (isCreate && result.doc.id) router.push(`${REVENDEDOR_PATH}/${result.doc.id}`)
    } catch (cause) { setError(revSaveIssue(cause)) } finally { setSaving(false) }
  }
  const endereco = revendedor.enderecoEntrega ?? {}
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>{isCreate ? 'Adicionar revendedor' : 'Editar revendedor'}</h1>{!isCreate ? <Link className="btn" href={`${REVENDEDOR_PATH}/create`}><Icon name="plus" />Adicionar revendedor</Link> : null}<span className="sp" /><Link className="lnk" href={REVENDEDOR_PATH}>Voltar para Revendedores</Link></div>
    {error ? <p id="bb-rev-error" className="bb-error" role="alert">{error.message}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="prev-wrap"><div className="bb-stack">
      <div className="bb-card"><div className="bd">
        <input id="bb-rev-empresa" className="ttl" aria-label="Razão social (empresa)" aria-invalid={error?.field === 'bb-rev-empresa'} placeholder="Razão social (empresa)" value={revendedor.empresa} disabled={disabled} onChange={e => change('empresa', e.target.value)} />
        <div className="fld" style={{ marginTop: 12 }}><label htmlFor="bb-rev-fantasia">Nome fantasia</label><input className="inp" id="bb-rev-fantasia" value={revendedor.nomeFantasia || ''} disabled={disabled} onChange={e => change('nomeFantasia', e.target.value)} /></div>

        <div className="bb-rev-sec">Acesso ao portal</div>
        <div className="row2">
          <div className="fld"><label htmlFor="bb-rev-email">E-mail de acesso (login)</label><input className="inp" id="bb-rev-email" type="email" aria-invalid={error?.field === 'bb-rev-email'} value={revendedor.email} disabled={disabled} onChange={e => change('email', e.target.value)} /></div>
          <div className="fld"><label htmlFor="bb-rev-password">{isCreate ? 'Senha de acesso' : 'Nova senha'}</label><input className="inp" id="bb-rev-password" type="password" autoComplete="new-password" aria-invalid={error?.field === 'bb-rev-password'} placeholder={isCreate ? 'Defina uma senha' : 'Deixe em branco para manter'} value={revendedor.password || ''} disabled={disabled} onChange={e => change('password', e.target.value)} /><span className="help">{isCreate ? 'Obrigatória no cadastro.' : 'Preencha só para trocar a senha.'}</span></div>
        </div>

        <div className="bb-rev-sec">Aprovação e tabela de preço</div>
        <div className="bb-rev-aprov">
          <div className="bb-rev-aprov-grid">
            <div className="fld"><label htmlFor="bb-rev-nivel">Nível (tabela de preço)</label><select className="inp" id="bb-rev-nivel" aria-invalid={error?.field === 'bb-rev-nivel'} value={revendedor.nivel || ''} disabled={disabled} onChange={e => change('nivel', e.target.value as NivelRevendedor | '')}><option value="">Sem nível</option>{NIVEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
            <label className="bb-rev-check" htmlFor="bb-rev-ativo"><input type="checkbox" id="bb-rev-ativo" checked={revendedor.ativo === true} disabled={disabled} onChange={e => change('ativo', e.target.checked)} /><span>Ativo (acesso liberado)</span></label>
          </div>
          {needsNivel
            ? <p className="bb-rev-aprov-warn" role="status">Escolha o nível (tabela de preço) para poder ativar. Aprovar e atribuir a tabela são o mesmo passo.</p>
            : <p className="help">Aprovar e atribuir a tabela são o mesmo passo: não dá para ativar sem nível.</p>}
        </div>

        <div className="bb-rev-sec">Dados da empresa</div>
        <div className="row2">
          <div className="fld"><label htmlFor="bb-rev-cnpj">CNPJ</label><input className="inp" id="bb-rev-cnpj" aria-invalid={error?.field === 'bb-rev-cnpj'} value={revendedor.cnpj || ''} disabled={disabled} onChange={e => change('cnpj', e.target.value)} /></div>
          <div className="fld"><label htmlFor="bb-rev-ie">Inscrição estadual</label><input className="inp" id="bb-rev-ie" value={revendedor.inscricaoEstadual || ''} disabled={disabled} onChange={e => change('inscricaoEstadual', e.target.value)} /></div>
        </div>
        <div className="row2">
          <div className="fld"><label htmlFor="bb-rev-responsavel">Responsável</label><input className="inp" id="bb-rev-responsavel" value={revendedor.responsavel || ''} disabled={disabled} onChange={e => change('responsavel', e.target.value)} /></div>
          <div className="fld"><label htmlFor="bb-rev-telefone">Telefone</label><input className="inp" id="bb-rev-telefone" value={revendedor.telefone || ''} disabled={disabled} onChange={e => change('telefone', e.target.value)} /></div>
        </div>
        <div className="row2">
          <div className="fld"><label htmlFor="bb-rev-whatsapp">WhatsApp</label><input className="inp" id="bb-rev-whatsapp" value={revendedor.whatsapp || ''} disabled={disabled} onChange={e => change('whatsapp', e.target.value)} /></div>
          <div className="fld"><label htmlFor="bb-rev-site">Site</label><input className="inp" id="bb-rev-site" value={revendedor.site || ''} disabled={disabled} onChange={e => change('site', e.target.value)} /></div>
        </div>

        <div className="bb-rev-sec">Endereço de entrega</div>
        <div className="fld"><label htmlFor="bb-rev-logradouro">Logradouro</label><input className="inp" id="bb-rev-logradouro" value={endereco.logradouro || ''} disabled={disabled} onChange={e => changeEndereco('logradouro', e.target.value)} /></div>
        <div className="row2">
          <div className="fld"><label htmlFor="bb-rev-bairro">Bairro</label><input className="inp" id="bb-rev-bairro" value={endereco.bairro || ''} disabled={disabled} onChange={e => changeEndereco('bairro', e.target.value)} /></div>
          <div className="fld"><label htmlFor="bb-rev-cidade">Cidade</label><input className="inp" id="bb-rev-cidade" value={endereco.cidade || ''} disabled={disabled} onChange={e => changeEndereco('cidade', e.target.value)} /></div>
        </div>
        <div className="row2">
          <div className="fld"><label htmlFor="bb-rev-uf">UF</label><input className="inp" id="bb-rev-uf" maxLength={2} value={endereco.uf || ''} disabled={disabled} onChange={e => changeEndereco('uf', e.target.value.toLocaleUpperCase('pt-BR'))} /></div>
          <div className="fld"><label htmlFor="bb-rev-cep">CEP</label><input className="inp" id="bb-rev-cep" value={endereco.cep || ''} disabled={disabled} onChange={e => changeEndereco('cep', e.target.value)} /></div>
        </div>

        <div className="fld"><label htmlFor="bb-rev-notas">Notas internas</label><textarea id="bb-rev-notas" rows={4} value={revendedor.notas || ''} disabled={disabled} onChange={e => change('notas', e.target.value)} /><span className="help">Uso interno. Não aparece para o revendedor.</span></div>
      </div><div className="pub"><div className="line bb-rev-situacao" style={{ padding: '0 16px 12px' }}>Situação: <span className={`st ${statusKey}`}>{statusLabel}</span>{dirty ? <span className="bb-warning">Alterações ainda não salvas</span> : null}</div><div className="foot"><Link className="lnk" href={REVENDEDOR_PATH}>Cancelar</Link><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}>{saving ? 'Salvando…' : 'Salvar revendedor'}</button></div></div></div>
    </div>
    <div className="prev"><RevendedorPreview revendedor={revendedor} /></div></div>
  </section></div>
}
