"use client"
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'
import { photo } from '../friendly/model'
import { Icon } from '../friendly/icons'
import { grupoLabel } from './categoria-model'
import { CATEGORIA_PATH, type CategoriaRow } from './categoria-model'
type Props = {
  categoria: CategoriaRow; canCreate: boolean; canDelete?: boolean
  reorder?: boolean; busy?: boolean; canMoveUp?: boolean; canMoveDown?: boolean; onMove?: (dir: 'up' | 'down') => void; onRemove?: () => void
  dragging?: boolean; dropTarget?: boolean; dropAfter?: boolean
  onDragStart?: () => void; onDragOver?: (event: React.DragEvent) => void; onDrop?: () => void; onDragEnd?: () => void
}
// Item L: a linha pode ser arrastada (grip) pra reordenar. As setinhas continuam
// pra quem navega por teclado / nao quer arrastar.
export function CategoriaListRow({ categoria, canCreate, canDelete = false, reorder = false, busy = false, canMoveUp = false, canMoveDown = false, onMove, onRemove, dragging = false, dropTarget = false, dropAfter = false, onDragStart, onDragOver, onDrop, onDragEnd }: Props) {
  const icone = photo(categoria.icone)
  const eco = categoria.grupo === 'ecologicos'
  // Guia verde: embaixo do alvo quando desce (dropAfter), em cima quando sobe.
  const guia = dropAfter ? 'inset 0 -2px 0 0 var(--green, #0a7d4f)' : 'inset 0 2px 0 0 var(--green, #0a7d4f)'
  const rowStyle: React.CSSProperties = dragging ? { opacity: 0.4 } : dropTarget ? { boxShadow: guia } : {}
  return <tr
    aria-busy={busy}
    draggable={reorder && !busy}
    style={rowStyle}
    onDragStart={reorder ? (event: React.DragEvent) => {
      // Firefox so inicia o arrasto se o dragstart escrever algo no dataTransfer.
      try { event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', String(categoria.id)) } catch { /* noop */ }
      onDragStart?.()
    } : undefined}
    onDragOver={reorder ? onDragOver : undefined}
    onDrop={reorder ? (event) => { event.preventDefault(); onDrop?.() } : undefined}
    onDragEnd={reorder ? () => onDragEnd?.() : undefined}
  >
    {reorder ? <td><div className="bb-cat-mv">
      <span
        className="bb-cat-grip"
        aria-hidden="true"
        title="Arraste para reordenar"
        style={{ cursor: busy ? 'default' : 'grab', display: 'inline-flex', alignItems: 'center', color: 'var(--muted, #8a8a8a)', padding: '2px 0' }}
      >
        <svg width="12" height="16" viewBox="0 0 12 16" aria-hidden="true"><g fill="currentColor"><circle cx="3.5" cy="3" r="1.3" /><circle cx="8.5" cy="3" r="1.3" /><circle cx="3.5" cy="8" r="1.3" /><circle cx="8.5" cy="8" r="1.3" /><circle cx="3.5" cy="13" r="1.3" /><circle cx="8.5" cy="13" r="1.3" /></g></svg>
      </span>
      <button type="button" className="bb-cat-mv-btn" aria-label={`Subir ${categoria.nome}`} disabled={busy || !canMoveUp} onClick={() => onMove?.('up')}><Icon name="chevron-up" /></button>
      <button type="button" className="bb-cat-mv-btn" aria-label={`Descer ${categoria.nome}`} disabled={busy || !canMoveDown} onClick={() => onMove?.('down')}><Icon name="chevron-down" /></button>
    </div></td> : null}
    <td>{icone?.url ? <img className="bb-cat-ico" src={icone.url} alt="" /> : <span className="bb-cat-ico vazio" aria-hidden>{categoria.nome.trim().charAt(0).toLocaleUpperCase('pt-BR') || '?'}</span>}</td>
    <td className="t"><Link href={`${CATEGORIA_PATH}/${categoria.id}`}>{categoria.nome}</Link><div className="ra"><Link className="lnk" href={`${CATEGORIA_PATH}/${categoria.id}`}>Editar</Link>{canCreate ? <><span>|</span><Link className="lnk" href={`${CATEGORIA_PATH}/create?copiar=${categoria.id}`}>Duplicar</Link></> : null}{canDelete ? <><span>|</span><button type="button" className="lnk red" disabled={busy} onClick={onRemove}>Excluir</button></> : null}</div></td>
    <td><span className={`bb-cat-grp ${eco ? 'eco' : ''}`}>{grupoLabel(categoria.grupo)}</span></td>
    <td>{categoria.ordem ?? 0}</td>
    <td>{categoria.produtosCount ?? 0}</td>
  </tr>
}
