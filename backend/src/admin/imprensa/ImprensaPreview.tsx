"use client"
import React from 'react'
import { dateLabelBR, materiaTags } from './imprensa-data'
import type { ImprensaDraft } from './imprensa-model'
// Previa fiel: a entrada de clipping como aparece na /imprensa (.press > .pr).
// Hoje o card do site mostra SO o veiculo e o titulo; data, resumo e link ficam
// salvos mas nao aparecem no card, por isso vao como dados salvos abaixo.
export function ImprensaPreview({ materia }: { materia: ImprensaDraft }) {
  const veiculo = materia.veiculo?.trim() || 'Veículo'
  const titulo = materia.titulo?.trim() || 'Título da matéria'
  const resumo = materia.resumo?.trim()
  const url = materia.url?.trim()
  const tags = materiaTags(materia)
  return <div className="bb-imp-preview">
    <div className="bb-imp-preview-bar"><b>Prévia</b><span className="help">Ilustrativa. Confira o site após publicar.</span></div>
    <div className="bb-imp-card">
      <small className="bb-imp-veiculo">{veiculo}</small>
      <b className="bb-imp-titulo">{titulo}</b>
    </div>
    <div className="bb-imp-dados">
      <span className="bb-imp-sec">Dados salvos</span>
      <span className="bb-imp-meta">{dateLabelBR(materia.data)}{url ? <> · <span className="bb-imp-link">{url}</span></> : null}</span>
      {resumo ? <p className="bb-imp-resumo">{resumo}</p> : <p className="bb-imp-resumo bb-imp-empty">Sem resumo.</p>}
      {tags.length ? <div className="bb-imp-tags">{tags.map(t => <span className="bb-imp-tag" key={t.id}>{t.nome}</span>)}</div> : null}
      <span className="bb-imp-note">Data, resumo e link ficam salvos no painel (hoje o card do site mostra só veículo e título).</span>
    </div>
  </div>
}
