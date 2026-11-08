"use client"
import React from 'react'
import type { UserDraft } from './users-model'
// Previa simples: o cartao da conta de administrador. Nao e conteudo do site; so
// ajuda a confirmar quem tera acesso ao painel.
export function UserPreview({ user, isNew }: { user: UserDraft; isNew: boolean }) {
  const email = user.email.trim()
  const inicial = (email.charAt(0) || '?').toLocaleUpperCase('pt-BR')
  return <div className="bb-user-preview">
    <div className="bb-user-preview-bar"><b>Prévia</b><span className="help">Conta de acesso ao painel.</span></div>
    <div className="bb-user-card">
      <span className="bb-user-ava" aria-hidden>{inicial}</span>
      <div className="bb-user-bd">
        <b>{email || 'e-mail do usuário'}</b>
        <span className="bb-user-role">Administrador do painel</span>
      </div>
    </div>
    <p className="bb-user-note">{isNew ? 'Ao salvar, esta pessoa passa a entrar no painel com o e-mail e a senha definidos.' : 'A senha só muda se você preencher o campo de nova senha.'}</p>
  </div>
}
