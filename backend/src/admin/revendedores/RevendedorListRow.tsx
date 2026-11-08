"use client"
import React from 'react'
import Link from 'next/link'
import { revStatus } from './revendedores-data'
import { nivelLabel, REVENDEDOR_PATH, type RevendedorRow } from './revendedores-model'

// Linha da lista de revendedores. Sem toggle de ativo: aprovar exige nivel no
// mesmo passo, entao a ativacao acontece no editor, nunca aqui.
export function RevendedorListRow({ revendedor, canUpdate }: { revendedor: RevendedorRow; canUpdate: boolean }) {
  const [statusKey, statusLabel] = revStatus(revendedor)
  return <tr>
    <td className="t">
      <Link href={`${REVENDEDOR_PATH}/${revendedor.id}`}>{revendedor.empresa || '(sem razão social)'}</Link>
      {revendedor.nomeFantasia ? <div className="bb-rev-fantasia-row">{revendedor.nomeFantasia}</div> : null}
      <div className="ra"><Link className="lnk" href={`${REVENDEDOR_PATH}/${revendedor.id}`}>{canUpdate ? 'Editar' : 'Ver'}</Link></div>
    </td>
    <td>{revendedor.cnpj || '-'}</td>
    <td>{revendedor.responsavel || '-'}</td>
    <td>{revendedor.nivel ? nivelLabel(revendedor.nivel) : <span className="bb-rev-sem-nivel">-</span>}</td>
    <td><span className={`st ${statusKey}`}>{statusLabel}</span></td>
  </tr>
}
