'use client'
import React from 'react'
import { useAllFormFields } from '@payloadcms/ui'
import { CodigosPorCorView, type CorItem } from './CodigosPorCorView'

// Item E: campo `ui` (sem dado proprio) que le o CIGAM e as cores do formulario e
// mostra a relacao de codigos por cor (read-only). Renderiza na view nativa do Payload
// (abre no drawer da relacao). A mesma CodigosPorCorView e reusada pela friendly view.

const RE_COR = /^cores\.(\d+)\.(nome|codigo)$/

export default function CodigosPorCorField() {
  const [fields] = useAllFormFields()

  const cigam = (fields?.codigoCigam?.value as string | undefined) ?? ''

  const porIndice: Record<number, CorItem> = {}
  for (const [path, state] of Object.entries(fields ?? {})) {
    const match = RE_COR.exec(path)
    if (!match) continue
    const idx = Number(match[1])
    const chave = match[2] as 'nome' | 'codigo'
    porIndice[idx] = porIndice[idx] ?? {}
    porIndice[idx][chave] = (state?.value as string | undefined) ?? null
  }
  const cores: CorItem[] = Object.keys(porIndice)
    .map(Number)
    .sort((a, b) => a - b)
    .map((idx) => porIndice[idx])

  return (
    <div className="field-type ui" style={{ marginBottom: '1.5rem' }}>
      <label className="field-label">Codigos por cor (CRM / Leads2b)</label>
      <CodigosPorCorView cigam={cigam} cores={cores} />
    </div>
  )
}
