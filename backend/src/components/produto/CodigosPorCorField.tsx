'use client'
import React from 'react'
import { useAllFormFields } from '@payloadcms/ui'
import { CodigosPorCorView, type CorItem } from './CodigosPorCorView'

// Item E: campo `ui` (sem dado proprio) que le o CIGAM e as cores do formulario e
// mostra a relacao de codigos por cor (read-only). Renderiza na view nativa do Payload
// (abre no drawer da relacao). A mesma CodigosPorCorView e reusada pela friendly view.

const RE_COR = /^cores\.(\d+)\.(nome|codigo)$/
// Item 5: cores do acessorio moram no group `variacao` (variacao.coresAcessorio.N).
const RE_COR_ACESSORIO = /^variacao\.coresAcessorio\.(\d+)\.(nome|codigo)$/

// Reconstroi uma lista de CorItem a partir dos campos do formulario que casam o regex.
function coresDoFormulario(
  fields: Record<string, { value?: unknown } | undefined>,
  re: RegExp,
): CorItem[] {
  const porIndice: Record<number, CorItem> = {}
  for (const [path, state] of Object.entries(fields)) {
    const match = re.exec(path)
    if (!match) continue
    const idx = Number(match[1])
    const chave = match[2] as 'nome' | 'codigo'
    porIndice[idx] = porIndice[idx] ?? {}
    porIndice[idx][chave] = (state?.value as string | undefined) ?? null
  }
  return Object.keys(porIndice)
    .map(Number)
    .sort((a, b) => a - b)
    .map((idx) => porIndice[idx])
}

export default function CodigosPorCorField() {
  const [fields] = useAllFormFields()

  const cigam = (fields?.codigoCigam?.value as string | undefined) ?? ''
  const cores = coresDoFormulario(fields ?? {}, RE_COR)
  const coresAcessorio = coresDoFormulario(fields ?? {}, RE_COR_ACESSORIO)

  return (
    <div className="field-type ui" style={{ marginBottom: '1.5rem' }}>
      <label className="field-label">Codigos por cor (CRM / Leads2b)</label>
      <CodigosPorCorView cigam={cigam} cores={cores} coresAcessorio={coresAcessorio} />
    </div>
  )
}
