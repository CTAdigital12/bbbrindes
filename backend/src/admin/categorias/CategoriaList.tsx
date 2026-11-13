"use client"
import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { moverCategoria, ordenarCategorias, reordenarPorArrasto } from './categoria-data'
import type { OrdemChange } from './categoria-data'
import { grupoRank } from './categoria-model'
import { CATEGORIA_PATH, type CategoriaRow } from './categoria-model'
import { CategoriaListRow } from './CategoriaListRow'
const FILTERS = [
  ['todos', 'Todas', () => true],
  ['ecologicos', 'Ecológicos', (c: CategoriaRow) => c.grupo === 'ecologicos'],
  ['geral', 'Geral', (c: CategoriaRow) => c.grupo !== 'ecologicos'],
] as const
export function CategoriaList({ initial, canCreate = true, canUpdate = true, canDelete = true }: { initial: CategoriaRow[]; canCreate?: boolean; canUpdate?: boolean; canDelete?: boolean }) {
  const [rows, setRows] = useState(initial)
  const [filter, setFilter] = useState('todos')
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [dragId, setDragId] = useState<number | null>(null)
  const [overId, setOverId] = useState<number | null>(null)
  const visible = useMemo(() => ordenarCategorias(rows
    .filter(FILTERS.find(f => f[0] === filter)![2])
    .filter(c => c.nome.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')))), [rows, filter, search])
  // Reordenar so com a lista inteira a vista (sem busca). Mover e dentro do grupo.
  const canReorder = canUpdate && !search.trim()
  // Indice da linha sendo arrastada (na vista atual): decide se a guia verde vai
  // em cima (subindo) ou embaixo (descendo) do alvo, batendo com reordenarPorArrasto.
  const dragIndex = dragId == null ? -1 : visible.findIndex(v => v.id === dragId)
  // Persiste a nova ordem (setinhas E arrasto usam o mesmo caminho). Otimista: pinta
  // a tela na hora e desfaz se a API recusar.
  async function salvarOrdens(nextRows: CategoriaRow[], changes: OrdemChange[]) {
    if (!changes.length) return
    const previous = rows
    setRows(nextRows); setBusy(true); setError(''); setMessage('')
    try {
      for (const change of changes) {
        await requestJSON(`/api/categorias/${change.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ordem: change.ordem }) })
      }
      setMessage('Nova ordem salva. O site pode levar alguns minutos para atualizar.')
    } catch (cause) { setRows(previous); setError((cause as Error).message) } finally { setBusy(false) }
  }
  async function mover(categoria: CategoriaRow, dir: 'up' | 'down') {
    const result = moverCategoria(rows, categoria.id, dir)
    await salvarOrdens(result.rows, result.changes)
  }
  async function soltar(targetId: number) {
    const source = dragId
    setDragId(null); setOverId(null)
    if (source == null || source === targetId) return
    const result = reordenarPorArrasto(rows, source, targetId)
    if (!result.changes.length) return
    await salvarOrdens(result.rows, result.changes)
  }
  async function remove(categoria: CategoriaRow) {
    if (!window.confirm(`Excluir "${categoria.nome}"? Esta ação não pode ser desfeita.`)) return
    setBusy(true); setError(''); setMessage('')
    try {
      await requestJSON(`/api/categorias/${categoria.id}`, { method: 'DELETE' })
      setRows(prev => prev.filter(c => c.id !== categoria.id))
      setMessage('Categoria excluída.')
    } catch (cause) { setError((cause as Error).message) } finally { setBusy(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Categorias</h1>{canCreate ? <Link className="btn" href={`${CATEGORIA_PATH}/create`}><Icon name="plus" />Adicionar categoria</Link> : null}</div>
    <p className="sub">Categorias do catálogo: a grade da home e o menu de produtos. Os Ecológicos ficam agrupados no topo; arraste pela alça (ou use as setas) para mudar a ordem dentro de cada grupo.</p>
    <div className="subsub">{FILTERS.map(([key, label, match], index) => <React.Fragment key={key}>{index ? <span className="sep">|</span> : null}<button type="button" className={filter === key ? 'on' : ''} onClick={() => setFilter(key)}>{label} <span className="n">({rows.filter(match).length})</span></button></React.Fragment>)}</div>
    <div className="toolbar"><span className="sp" /><input className="inp search" type="search" aria-label="Buscar categorias" placeholder="Buscar categorias…" value={search} onChange={event => setSearch(event.target.value)} /></div>
    {canUpdate && search.trim() ? <p className="help">Limpe a busca para reordenar as categorias.</p> : null}
    {error ? <p className="bb-error" role="alert">{error}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="bb-table-scroll"><table className="list"><thead><tr>{canReorder ? <th>Ordenar</th> : null}<th>Ícone</th><th>Categoria</th><th>Grupo</th><th>Ordem</th><th>Produtos</th></tr></thead><tbody>{visible.map((c, index) => <CategoriaListRow
      key={c.id}
      categoria={c}
      canCreate={canCreate}
      canDelete={canDelete}
      reorder={canReorder}
      busy={busy}
      canMoveUp={index > 0 && grupoRank(visible[index - 1].grupo) === grupoRank(c.grupo)}
      canMoveDown={index < visible.length - 1 && grupoRank(visible[index + 1].grupo) === grupoRank(c.grupo)}
      onMove={dir => void mover(c, dir)}
      onRemove={() => void remove(c)}
      dragging={dragId === c.id}
      dropTarget={overId === c.id && dragId !== null && dragId !== c.id && grupoRank(c.grupo) === grupoRank(visible.find(v => v.id === dragId)?.grupo)}
      dropAfter={dragIndex >= 0 && dragIndex < index}
      onDragStart={() => setDragId(c.id)}
      onDragOver={event => { if (dragId !== null && dragId !== c.id) { event.preventDefault(); try { event.dataTransfer.dropEffect = 'move' } catch { /* noop */ } setOverId(c.id) } }}
      onDrop={() => void soltar(c.id)}
      onDragEnd={() => { setDragId(null); setOverId(null) }}
    />)}{!visible.length ? <tr><td colSpan={canReorder ? 6 : 5} className="empty">Nenhuma categoria neste filtro.</td></tr> : null}</tbody></table></div>
  </section></div>
}
