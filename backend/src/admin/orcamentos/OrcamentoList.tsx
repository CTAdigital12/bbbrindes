"use client"
import React, { useMemo, useState } from 'react'
import { requestJSON } from '../friendly/api'
import { useDialog } from '../friendly/useDialog'
import { contatoMascarado, dataHora, matchStatus, modoLabel, statusKey, statusLabel, STATUS_FILTERS } from './orcamento-data'
import type { OrcamentoRow, OrcamentoStatus } from './orcamento-model'
function OrcamentoDetail({ row, onClose }: { row: OrcamentoRow; onClose: () => void }) {
  const dialog = useDialog(onClose)
  const linhas: [string, string][] = [
    ['Recebido em', dataHora(row.createdAt)],
    ['Empresa', row.empresa || '-'],
    ['E-mail', row.emailMascarado || '-'],
    ['Telefone', row.telefoneMascarado || '-'],
    ['Itens diferentes', String(row.qtdItens ?? '-')],
    ['Total de unidades', String(row.totalUnidades ?? '-')],
    ['Modo', modoLabel(row.modo)],
    ['Consentimento LGPD', row.consentimento ? 'Sim' : 'Nao'],
    ['Id da requisicao', row.requisicaoId || '-'],
    ['Id no CRM', row.crmId || '-'],
  ]
  return <div className="ov" onClick={e => { if (e.target === e.currentTarget) onClose() }}><div ref={dialog} className="modal bb-orc-modal" role="dialog" aria-modal="true" aria-labelledby="bb-orc-mt">
    <div className="mh"><h2 id="bb-orc-mt">Pedido de orçamento</h2><span className={`st ${statusKey(row.status)}`}>{statusLabel(row.status)}</span><span className="sp" /><button type="button" className="x-btn" aria-label="Fechar" onClick={onClose}>×</button></div>
    <div className="bb-orc-detail"><dl>{linhas.map(([rotulo, valor]) => <div key={rotulo}><dt>{rotulo}</dt><dd>{valor}</dd></div>)}</dl>
      {row.erro ? <div className="bb-orc-erro"><b>Erro na entrega</b><p>{row.erro}</p></div> : null}
      <p className="help">Os dados de contato aparecem mascarados por LGPD. O conteúdo completo do pedido segue para o comercial pelo CRM ou WhatsApp.</p>
    </div>
  </div></div>
}
export function OrcamentoList({ initial, canDelete = true }: { initial: OrcamentoRow[]; canDelete?: boolean }) {
  const [rows, setRows] = useState(initial)
  const [filtro, setFiltro] = useState<'todos' | OrcamentoStatus>('todos')
  const [busca, setBusca] = useState('')
  const [aberto, setAberto] = useState<OrcamentoRow>()
  const [busy, setBusy] = useState<number>()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const visible = useMemo(() => rows.filter(matchStatus(filtro)).filter(r => (r.empresa || '').toLocaleLowerCase('pt-BR').includes(busca.toLocaleLowerCase('pt-BR'))), [rows, filtro, busca])
  async function remove(row: OrcamentoRow) {
    if (!window.confirm(`Excluir o pedido de "${row.empresa || 'empresa não informada'}"? Esta ação não pode ser desfeita.`)) return
    setBusy(row.id); setError(''); setMessage('')
    try {
      await requestJSON(`/api/logs-entrega/${row.id}`, { method: 'DELETE' })
      setRows(current => current.filter(r => r.id !== row.id))
      setMessage('Pedido excluído.')
    } catch (cause) { setError((cause as Error).message) } finally { setBusy(undefined) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Orçamentos</h1></div>
    <p className="sub">Pedidos de orçamento enviados pelo site (auditoria de entrega). Somente leitura. Status "Simulado" significa que o CRM ainda não está conectado: o pedido chegou ao backend e segue para o comercial pelo WhatsApp até a integração ser ligada.</p>
    <div className="subsub">{STATUS_FILTERS.map(({ value, label }, index) => <React.Fragment key={value}>{index ? <span className="sep">|</span> : null}<button type="button" className={filtro === value ? 'on' : ''} onClick={() => setFiltro(value)}>{label} <span className="n">({value === 'todos' ? rows.length : rows.filter(r => r.status === value).length})</span></button></React.Fragment>)}</div>
    <div className="toolbar"><span className="sp" /><input className="inp search" type="search" aria-label="Buscar por empresa" placeholder="Buscar por empresa…" value={busca} onChange={e => setBusca(e.target.value)} /></div>
    {error ? <p className="bb-error" role="alert">{error}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="bb-table-scroll"><table className="list"><thead><tr><th>Recebido</th><th>Empresa</th><th>Status</th><th>Itens</th><th>Unidades</th><th>Modo</th><th>Contato</th>{canDelete ? <th>Ações</th> : null}</tr></thead><tbody>{visible.map(row => <tr key={row.id} className="bb-orc-row" tabIndex={0} role="button" aria-label={`Ver pedido de ${row.empresa || 'empresa nao informada'}`} onClick={() => setAberto(row)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setAberto(row) } }}>
      <td>{dataHora(row.createdAt)}</td>
      <td className="t">{row.empresa || '-'}</td>
      <td><span className={`st ${statusKey(row.status)}`}>{statusLabel(row.status)}</span></td>
      <td>{row.qtdItens ?? '-'}</td>
      <td>{row.totalUnidades ?? '-'}</td>
      <td>{modoLabel(row.modo)}</td>
      <td>{contatoMascarado(row)}</td>
      {canDelete ? <td><button type="button" className="lnk red" disabled={busy === row.id} onClick={e => { e.stopPropagation(); void remove(row) }}>Excluir</button></td> : null}
    </tr>)}{!visible.length ? <tr><td colSpan={canDelete ? 8 : 7} className="empty">Nenhum pedido neste filtro.</td></tr> : null}</tbody></table></div>
    {aberto ? <OrcamentoDetail row={aberto} onClose={() => setAberto(undefined)} /> : null}
  </section></div>
}
