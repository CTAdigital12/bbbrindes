'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ConfirmLeave } from './ConfirmLeave'

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
    <ConfirmLeave
      title="Alterações não salvas"
      titleId="bb-unsaved-title"
      guardMarker
      onStay={ficar}
      onDiscard={sair}
    >
      <p style={{ margin: 0 }}>
        Você tem alterações que ainda não foram salvas nesta edição. Se sair agora, vai perder o que não foi salvo.
      </p>
    </ConfirmLeave>
  )
}
