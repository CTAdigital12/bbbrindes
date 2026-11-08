"use client"
import React from 'react'
import { caseTags } from './cases-data'
import type { CaseDraft } from './cases-model'
// Previa fiel: o card de prova social como aparece na /cases e na home
// (componente CasesHome / .case.case-text). Sem foto por case (decisao 27/10): o
// topo e uma faixa de marca verde com o nome do cliente; depois segmento, titulo
// e resumo. depoimento e tags ficam guardados mas hoje NAO aparecem no card, por
// isso vao como nota ilustrativa abaixo.
export function CasePreview({ caseItem }: { caseItem: CaseDraft }) {
  const cliente = caseItem.cliente.trim() || 'Cliente'
  const titulo = caseItem.titulo.trim() || 'Título do case'
  const segmento = caseItem.segmento?.trim()
  const resumo = caseItem.resumo?.trim()
  const depo = caseItem.depoimento
  const tags = caseTags(caseItem)
  return <div className="bb-cases-preview">
    <div className="bb-cases-preview-bar"><b>Prévia</b><span className="help">Ilustrativa. Confira o site após publicar.</span></div>
    <article className="bb-cases-card">
      <div className="bb-cases-band"><span className="bb-cases-cli">{cliente}</span></div>
      <div className="bb-cases-bd">
        {segmento ? <small className="bb-cases-seg">{segmento}</small> : null}
        <h3 className="bb-cases-ttl">{titulo}</h3>
        {resumo ? <p className="bb-cases-resumo">{resumo}</p> : <p className="bb-cases-resumo bb-cases-empty">Sem resumo ainda.</p>}
      </div>
    </article>
    {depo?.texto?.trim() ? <div className="bb-cases-quote"><p>“{depo.texto.trim()}”</p>{depo.autor?.trim() ? <span>{depo.autor.trim()}</span> : null}</div> : null}
    {tags.length ? <div className="bb-cases-tags">{tags.map(t => <span className="bb-cases-tag" key={t.id}>{t.nome}</span>)}</div> : null}
    {(depo?.texto?.trim() || tags.length) ? <p className="bb-cases-note">Depoimento e tags ficam salvos no painel (hoje não aparecem no card do site).</p> : null}
  </div>
}
