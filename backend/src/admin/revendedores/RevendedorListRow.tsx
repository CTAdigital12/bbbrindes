"use client"
import React from 'react'
import Link from 'next/link'
import { revStatus } from './revendedores-data'
import { nivelLabel, REVENDEDOR_PATH, type RevendedorRow } from './revendedores-model'

// Linha da lista de revendedores. Sem toggle de ativo: aprovar exige nivel no
// mesmo passo, entao a ativacao acontece no editor, nunca aqui. O Excluir pode
// remover qualquer revendedor (sem regra de "nao se auto-excluir", como Usuarios).
export function RevendedorListRow({ revendedor, canUpdate, canDelete, busy, onRemove }: { revendedor: RevendedorRow; canUpdate: boolean; canDelete: boolean; busy: boolean; onRemove: () => void }) {
  const [statusKey, statusLabel] = revStatus(revendedor)
  return <tr aria-busy={busy}>
    <td className="t">
      <Link href={`${REVENDEDOR_PATH}/${revendedor.id}`}>{revendedor.empresa || '(sem razão social)'}</Link>
      {revendedor.nomeFantasia ? <div className="bb-rev-fantasia-row">{revendedor.nomeFantasia}</div> : null}
      <div className="ra"><Link className="lnk" href={`${REVENDEDOR_PATH}/${revendedor.id}`}>{canUpdate ? 'Editar' : 'Ver'}</Link>{canDelete ? <><span>|</span><button type="button" className="lnk red" disabled={busy} onClick={onRemove}>Excluir</button></> : null}</div>
    </td>
    <td>{revendedor.cnpj || '-'}</td>
    <td>{revendedor.responsavel || '-'}</td>
    <td>{revendedor.nivel ? nivelLabel(revendedor.nivel) : <span className="bb-rev-sem-nivel">-</span>}</td>
    <td><span className={`st ${statusKey}`}>{statusLabel}</span></td>
  </tr>
}
