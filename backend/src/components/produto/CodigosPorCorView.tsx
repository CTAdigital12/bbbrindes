'use client'
import React from 'react'
import { codigoDaCor } from './cores-bb'

// Item E (integracao CRM/Leads2b): exibicao READ-ONLY da relacao de codigos por cor.
// O que vai para o CRM/ERP a cada orcamento = codigo CIGAM do produto + codigo da COR.
// Aqui so MOSTRAMOS esse pareamento (nao e editavel): a fonte da verdade da cor e a
// aba Cores; o CIGAM fica na identificacao. Componente puro, reusado pela view nativa
// e pela aba Comercial da friendly view.

export type CorItem = { nome?: string | null; codigo?: string | null }

export function CodigosPorCorView({
  cigam,
  cores,
}: {
  cigam?: string | null
  cores?: CorItem[] | null
}) {
  const linhas = (cores ?? []).map((cor) => {
    const codigoCor = codigoDaCor(cor)
    return {
      nome: cor.nome || '(sem nome)',
      codigoCor,
      // Identificador comunicado ao CRM: CIGAM + codigo de cor (ex.: MV01109-02).
      ref: cigam && codigoCor ? `${cigam}-${codigoCor}` : null,
    }
  })

  return (
    <div className="bb-codigos-cor">
      <p className="sub">
        Relacao enviada ao CRM/Leads2b a cada orcamento: codigo CIGAM do produto mais o
        codigo da cor. Somente leitura (as cores sao editadas na aba Cores, o CIGAM na
        identificacao).
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
              <th>Cor</th>
              <th>Codigo da cor</th>
              <th>Referencia CRM</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha, index) => (
              <tr key={index}>
                <td>{linha.nome}</td>
                <td>{linha.codigoCor ?? <span className="bb-warning">sem codigo</span>}</td>
                <td>{linha.ref ?? <span className="help">incompleto</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
