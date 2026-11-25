'use client'
import React from 'react'
import { codigoDaCor } from './cores-bb'
import { montarRefCrm } from './ref-crm'

// Item E (integracao CRM/Leads2b): exibicao READ-ONLY da relacao de codigos por cor.
// O que vai para o CRM/ERP a cada orcamento = codigo CIGAM do produto + base(2) +
// acessorio(2), SEM hifen (ver ref-crm.ts). Aqui so MOSTRAMOS esse pareamento (nao e
// editavel): a fonte da verdade das cores e a aba Cores, o CIGAM fica na identificacao.
// Item 5 (cores base x acessorio): quando o produto tem cores de acessorio, cada
// combinacao base x acessorio gera uma referencia; sem acessorio, a cor e unica e o
// acessorio vira "00" (ex. MV014440200). Componente puro, reusado pela view nativa e
// pela aba Comercial da friendly view.

export type CorItem = { nome?: string | null; codigo?: string | null }

export function CodigosPorCorView({
  cigam,
  cores,
  coresAcessorio,
}: {
  cigam?: string | null
  cores?: CorItem[] | null
  coresAcessorio?: CorItem[] | null
}) {
  const bases = cores ?? []
  const acessorios = coresAcessorio ?? []
  const temAcessorio = acessorios.length > 0

  // Sem cores de acessorio: cor unica (acessorio = 00). Linha por cor base.
  // Com cores de acessorio: uma linha por combinacao base x acessorio.
  const linhas = temAcessorio
    ? bases.flatMap((base) => {
        const codigoBase = codigoDaCor(base)
        return acessorios.map((acessorio) => {
          const codigoAcessorio = codigoDaCor(acessorio)
          return {
            nome: `${base.nome || '(sem nome)'} x ${acessorio.nome || '(sem nome)'}`,
            codigo:
              codigoBase || codigoAcessorio
                ? `${codigoBase ?? '--'} x ${codigoAcessorio ?? '--'}`
                : null,
            ref: cigam ? montarRefCrm(cigam, codigoBase, codigoAcessorio) : null,
          }
        })
      })
    : bases.map((base) => {
        const codigoBase = codigoDaCor(base)
        return {
          nome: base.nome || '(sem nome)',
          codigo: codigoBase ?? null,
          ref: cigam ? montarRefCrm(cigam, codigoBase) : null,
        }
      })

  return (
    <div className="bb-codigos-cor">
      <p className="sub">
        Relacao enviada ao CRM/Leads2b a cada orcamento: codigo CIGAM do produto mais o
        codigo da cor. {temAcessorio
          ? 'Como o produto tem cor de acessorio, cada combinacao base x acessorio gera uma referencia. '
          : ''}
        Somente leitura (as cores sao editadas na aba Cores, o CIGAM na identificacao).
      </p>
      <div className="bb-codigos-cor-head">
        <span>CIGAM do produto:</span> <strong>{cigam || 'sem codigo CIGAM'}</strong>
      </div>
      {linhas.length === 0 ? (
        <p className="help">Nenhuma cor cadastrada ainda.</p>
      ) : (
        <table className="bb-codigos-cor-tabela">
          <thead>
            <tr>
              <th>{temAcessorio ? 'Cor (base x acessorio)' : 'Cor'}</th>
              <th>{temAcessorio ? 'Codigo (base x acessorio)' : 'Codigo da cor'}</th>
              <th>Referencia CRM</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha, index) => (
              <tr key={index}>
                <td>{linha.nome}</td>
                <td>{linha.codigo ?? <span className="bb-warning">sem codigo</span>}</td>
                <td>{linha.ref ?? <span className="help">incompleto</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
