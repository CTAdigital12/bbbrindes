'use client'
import React from 'react'

// Modal padrao de confirmacao de "sair sem salvar" do admin.
// Usado pela guarda global de navegacao (unsaved-guard) e pelo seletor de
// produtos da campanha (ProductPicker), pra os dois mostrarem o MESMO visual
// (cartao, titulo, texto e botoes). A logica (o que acontece em cada botao)
// continua em quem chama; aqui fica so a UI.
// - inset: cobre apenas o elemento pai (um modal), com fundo claro. Sem inset,
//   vira overlay fixo de tela cheia com fundo escuro.
// - confirm (opcional): acao intermediaria, ex. "Aplicar e sair" do ProductPicker.

type Props = {
  title: string
  children?: React.ReactNode
  stayLabel?: string
  discardLabel?: string
  onStay: () => void
  onDiscard: () => void
  confirmLabel?: string
  onConfirm?: () => void
  inset?: boolean
  closeOnBackdrop?: boolean
  guardMarker?: boolean
  titleId?: string
}

export function ConfirmLeave({
  title,
  children,
  stayLabel = 'Ficar e continuar',
  discardLabel = 'Sair sem salvar',
  onStay,
  onDiscard,
  confirmLabel,
  onConfirm,
  inset = false,
  closeOnBackdrop = !inset,
  guardMarker = false,
  titleId = 'bb-confirm-leave-title',
}: Props) {
  const overlayStyle: React.CSSProperties = inset
    ? { position: 'absolute', inset: 0, background: 'rgba(255,255,255,.94)', display: 'grid', placeItems: 'center', padding: 24, zIndex: 5, borderRadius: 'inherit' }
    : { position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(18,26,22,.45)', display: 'grid', placeItems: 'center', padding: 24 }
  const cardStyle: React.CSSProperties = inset
    ? { maxWidth: 460, width: '100%' }
    : { background: '#fff', color: '#1a221d', maxWidth: 440, width: '100%', borderRadius: 12, padding: 20, boxShadow: '0 12px 44px rgba(0,0,0,.28)' }
  return (
    <div
      data-unsaved-guard={guardMarker ? '' : undefined}
      role="alertdialog"
      aria-labelledby={titleId}
      onClick={closeOnBackdrop ? (event) => { if (event.target === event.currentTarget) onStay() } : undefined}
      style={overlayStyle}
    >
      <div style={cardStyle}>
        <h3 id={titleId} style={{ margin: '0 0 8px', fontSize: 18 }}>{title}</h3>
        <div style={{ margin: '0 0 16px', color: inset ? undefined : '#5b6a61', lineHeight: 1.5 }}>{children}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button type="button" className="btn pri" onClick={onStay}>{stayLabel}</button>
          {confirmLabel && onConfirm ? <button type="button" className="btn" onClick={onConfirm}>{confirmLabel}</button> : null}
          <button type="button" className="btn ghost" style={{ color: '#c0392b', borderColor: '#e2b4ad' }} onClick={onDiscard}>{discardLabel}</button>
        </div>
      </div>
    </div>
  )
}
