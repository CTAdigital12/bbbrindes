"use client"
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { photo } from '../friendly/model'
import { depoimentoFonte, type DepoimentoDraft } from './depoimento-model'
// Previa fiel ao card de depoimento da home (.quotes .qt): aspas, texto e a fonte
// "Autor, Empresa". A foto, quando houver, aparece junto da fonte.
export function DepoimentoPreview({ depoimento }: { depoimento: DepoimentoDraft }) {
  const foto = photo(depoimento.foto)?.url
  const texto = depoimento.texto.trim()
  const fonte = depoimentoFonte(depoimento) || 'Autor, Empresa'
  const active = depoimento.ativo !== false
  return <div className="bb-dep-preview">
    <div className="bb-dep-preview-bar"><b>Prévia</b><span className="help">Ilustrativa. Confira o site após publicar.</span></div>
    <div className="bb-dep-qt">
      <span className="bb-dep-qmark" aria-hidden>“</span>
      <div className="bb-dep-qt-bd">
        {texto ? <p className="bb-dep-texto">{texto}</p> : <p className="bb-dep-texto bb-dep-empty">Escreva o depoimento para ver a prévia.</p>}
        <div className="bb-dep-fonte">{foto ? <img className="bb-dep-fonte-foto" src={foto} alt="" /> : null}<span>{fonte}</span></div>
      </div>
    </div>
    {!active ? <p className="bb-dep-off">Inativo: não aparece no site enquanto estiver desligado.</p> : null}
  </div>
}
