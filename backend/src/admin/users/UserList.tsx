"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { UserListRow } from './UserListRow'
import { USER_PATH, type UserRow } from './users-model'
export function UserList({ initial, canCreate = true, canUpdate = true, canDelete = true, currentUserId }: {
  initial: UserRow[]; canCreate?: boolean; canUpdate?: boolean; canDelete?: boolean; currentUserId?: number
}) {
  const [rows, setRows] = useState(initial)
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState<number>()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const visible = useMemo(() => rows.filter(u => u.email.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))), [rows, search])
  async function remove(user: UserRow) {
    if (user.id === currentUserId) return
    if (!window.confirm(`Remover o acesso de ${user.email} ao painel? Esta acao nao pode ser desfeita.`)) return
    setBusy(user.id); setError(''); setMessage('')
    try {
      await requestJSON(`/api/users/${user.id}`, { method: 'DELETE' })
      setRows(current => current.filter(u => u.id !== user.id))
      setMessage('Usuario removido.')
    } catch (cause) { setError((cause as Error).message) } finally { setBusy(undefined) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Usuários</h1>{canCreate ? <Link className="btn" href={`${USER_PATH}/create`}><Icon name="plus" />Adicionar usuário</Link> : null}</div>
    <p className="sub">Administradores que entram no painel. Cada um usa o próprio e-mail e senha para acessar.</p>
    <div className="toolbar"><span className="sp" /><input className="inp search" type="search" aria-label="Buscar por e-mail" placeholder="Buscar por e-mail…" value={search} onChange={e => setSearch(e.target.value)} /></div>
    {error ? <p className="bb-error" role="alert">{error}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="bb-table-scroll"><table className="list"><thead><tr><th>E-mail</th><th>Criado em</th><th>Ações</th></tr></thead><tbody>{visible.map(u => <UserListRow key={u.id} user={u} busy={busy === u.id} canUpdate={canUpdate} canDelete={canDelete} isSelf={u.id === currentUserId} onRemove={() => void remove(u)} />)}{!visible.length ? <tr><td colSpan={3} className="empty">Nenhum usuário encontrado.</td></tr> : null}</tbody></table></div>
  </section></div>
}
