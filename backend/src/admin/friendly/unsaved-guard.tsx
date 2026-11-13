'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

// Guarda GLOBAL de "alterações não salvas".
// - Cada editor chama useUnsavedGuard(dirty) e reporta se tem edição pendente.
// - UnsavedGuardHost fica montado na sidebar (presente em toda página do admin) e,
//   enquanto houver edição pendente, intercepta cliques em links internos (Cancelar,
//   Voltar, menu lateral, etc.) e pede confirmação antes de sair.
// - O beforeunload (atualizar/fechar a aba) continua em cada editor.

let dirtyCount = 0
const listeners = new Set<() => void>()
function emit() { listeners.forEach((fn) => fn()) }
function subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn) } }
export function isDirty() { return dirtyCount > 0 }
export function clearDirty() { dirtyCount = 0; emit() }
function bump(on: boolean, ref: { on: boolean }) {
  if (ref.on === on) return
  ref.on = on
  dirtyCount = Math.max(0, dirtyCount + (on ? 1 : -1))
  emit()
}

// Usado por cada editor: reporta o dirty atual e zera ao desmontar.
export function useUnsavedGuard(dirty: boolean) {
  const ref = useRef({ on: false })
  useEffect(() => { bump(dirty, ref.current) }, [dirty])
  useEffect(() => () => { bump(false, ref.current) }, [])
}

function isInternalNav(a: HTMLAnchorElement): boolean {
  if (a.target && a.target !== '_self') return false
  if (a.hasAttribute('download')) return false
  const href = a.getAttribute('href') || ''
  // só navegação interna do app (SPA). Externos, mailto, âncora e nova aba passam.
  return href.startsWith('/')
}

export function UnsavedGuardHost() {
  const router = useRouter()
  const [pending, setPending] = useState<string | null>(null)
  const pendingRef = useRef<string | null>(null)
  pendingRef.current = pending

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!isDirty() || pendingRef.current) return
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target as Element | null
      const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!anchor || anchor.closest('[data-unsaved-guard]')) return
      if (!isInternalNav(anchor)) return
      event.preventDefault(); event.stopPropagation()
      setPending(anchor.getAttribute('href'))
    }
    function onKey(event: KeyboardEvent) { if (event.key === 'Escape' && pendingRef.current) setPending(null) }
    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('click', onClick, true); document.removeEventListener('keydown', onKey) }
  }, [])

  function ficar() { setPending(null) }
  function sair() {
    const href = pendingRef.current
    setPending(null)
    clearDirty()
    if (href) router.push(href)
  }
  if (!pending) return null
  return (
    <div
      data-unsaved-guard
      role="alertdialog"
      aria-labelledby="bb-unsaved-title"
      onClick={(e) => { if (e.target === e.currentTarget) ficar() }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(18,26,22,.45)', display: 'grid', placeItems: 'center', padding: 24 }}
    >
      <div style={{ background: '#fff', color: '#1a221d', maxWidth: 440, width: '100%', borderRadius: 12, padding: 20, boxShadow: '0 12px 44px rgba(0,0,0,.28)' }}>
        <h3 id="bb-unsaved-title" style={{ margin: '0 0 8px', fontSize: 18 }}>Alterações não salvas</h3>
        <p style={{ margin: '0 0 16px', color: '#5b6a61', lineHeight: 1.5 }}>
          Você tem alterações que ainda não foram salvas nesta edição. Se sair agora, vai perder o que não foi salvo.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button type="button" className="btn pri" onClick={ficar}>Ficar e continuar</button>
          <button type="button" className="btn ghost" style={{ color: '#c0392b', borderColor: '#e2b4ad' }} onClick={sair}>Sair sem salvar</button>
        </div>
      </div>
    </div>
  )
}
