'use client'
import { useUnsavedGuard } from '../friendly/unsaved-guard'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { userBody, userSaveIssue, validateUser } from './users-data'
import { USER_PATH, USER_ROLES, type UserDraft, type UserIssue } from './users-model'
import { UserPreview } from './UserPreview'
export function UserEditor({ initial, canSave = true }: { initial: UserDraft; canSave?: boolean }) {
  const router = useRouter()
  const isNew = !initial.id
  const [original, setOriginal] = useState<UserDraft>(initial)
  const [user, setUser] = useState<UserDraft>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<UserIssue>()
  const [message, setMessage] = useState('')
  const dirty = JSON.stringify(user) !== JSON.stringify(original)
  useUnsavedGuard(dirty)
  const disabled = !canSave || saving
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
  function change(field: 'email' | 'password' | 'role', value: string) { setUser(current => ({ ...current, [field]: value }) as UserDraft); setMessage(''); setError(undefined) }
  async function save() {
    const issue = validateUser(user, isNew)
    if (issue) { setError({ ...issue }); return }
    setSaving(true); setError(undefined); setMessage('')
    try {
      const body = userBody(user, original.id ? original : undefined)
      if (!Object.keys(body).length) { setMessage('Nenhuma alteração para salvar.'); return }
      const result = await requestJSON<{ doc: UserDraft }>(`/api/users${original.id ? `/${original.id}` : ''}`, { method: original.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const saved = { ...result.doc, password: '' }
      setUser(saved); setOriginal(saved)
      setMessage('Usuário salvo.')
      if (!original.id && result.doc.id) router.push(`${USER_PATH}/${result.doc.id}`)
    } catch (cause) { setError(userSaveIssue(cause)) } finally { setSaving(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>{isNew ? 'Adicionar usuário' : 'Editar usuário'}</h1>{!isNew ? <Link className="btn" href={`${USER_PATH}/create`}><Icon name="plus" />Adicionar usuário</Link> : null}<span className="sp" /><Link className="lnk" href={USER_PATH}>Voltar para Usuários</Link></div>
    {error ? <p id="bb-user-error" className="bb-error" role="alert">{error.message}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="prev-wrap"><div className="bb-stack">
      <div className="bb-card"><div className="bd">
        <div className="fld"><label htmlFor="bb-user-email">E-mail de acesso</label><input className="inp" id="bb-user-email" type="email" autoComplete="off" aria-invalid={error?.field === 'bb-user-email'} placeholder="nome@bbbrindes.com.br" value={user.email} disabled={disabled} onChange={e => change('email', e.target.value)} /></div>
        <div className="fld"><label htmlFor="bb-user-senha">{isNew ? 'Senha' : 'Nova senha'}</label><input className="inp" id="bb-user-senha" type="password" autoComplete="new-password" aria-invalid={error?.field === 'bb-user-senha'} placeholder={isNew ? 'Ao menos 8 caracteres' : 'Deixe em branco para manter a atual'} value={user.password || ''} disabled={disabled} onChange={e => change('password', e.target.value)} /><span className="help">{isNew ? 'O usuário entra no painel com este e-mail e senha.' : 'Preencha só se quiser trocar a senha.'}</span></div>
        <div className="fld"><label htmlFor="bb-user-role">Nível de acesso</label><select className="inp" id="bb-user-role" value={user.role || 'admin'} disabled={disabled} onChange={e => change('role', e.target.value)}>{USER_ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}</select><span className="help">{USER_ROLES.find(r => r.value === (user.role || 'admin'))?.hint}</span></div>
      </div><div className="pub"><div className="line" style={{ padding: '0 16px 12px' }}>{dirty ? <span className="bb-warning">Alterações ainda não salvas</span> : <span className="help">Tudo salvo.</span>}</div><div className="foot"><Link className="lnk" href={USER_PATH}>Cancelar</Link><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}>{saving ? 'Salvando…' : 'Salvar usuário'}</button></div></div></div>
    </div>
    <div className="prev"><UserPreview user={user} isNew={isNew} /></div></div>
  </section></div>
}
