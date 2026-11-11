'use client'
import React from 'react'
import { CORES_BB, GRUPOS_CORES, normalizarNome, type CorBB } from './cores-bb'

// Item A (revisao Plinio 10/11): a aba Cores deixa de ser texto livre. Mostramos a
// paleta com TODAS as cores da BB (uma bolinha por cor) e a pessoa so MARCA as que o
// produto tem. O dado gravado continua compativel com o site (cores[].nome/hex/imagem):
// cada cor marcada vira uma entrada { nome, codigo }. O `codigo` (tabela mestra do CRM)
// alimenta o item E (codigos por cor). A foto-por-cor ja ligada e preservada: o seletor
// so adiciona/remove entradas, nunca mexe na imagem/hex das que continuam marcadas.

// Tipo frouxo de propósito: serve a friendly view e a nativa sem acoplar ao model.
export type CorMarcada = {
  id?: string
  nome: string
  hex?: string | null
  codigo?: string | null
  imagem?: unknown
}

function estaMarcada(cor: CorBB, atuais: CorMarcada[]): number {
  return atuais.findIndex(
    (c) =>
      (c.codigo && String(c.codigo).padStart(2, '0') === cor.codigo) ||
      normalizarNome(c.nome) === normalizarNome(cor.nome),
  )
}

function Bolinha({ hex }: { hex: string }) {
  const estilo: React.CSSProperties = hex
    ? { background: hex }
    : {
        // cromia / mix / especial: sem tom unico, render multicor.
        background: 'conic-gradient(#ef4444,#f59e0b,#eab308,#22c55e,#3b82f6,#a855f7,#ef4444)',
      }
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        width: 18,
        height: 18,
        borderRadius: '50%',
        border: '1px solid rgba(0,0,0,0.2)',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)',
        ...estilo,
      }}
    />
  )
}

export function PaletaCores({
  value,
  onChange,
  disabled,
}: {
  value: CorMarcada[]
  onChange: (cores: CorMarcada[]) => void
  disabled?: boolean
}) {
  const atuais = value ?? []

  function alternar(cor: CorBB) {
    if (disabled) return
    const idx = estaMarcada(cor, atuais)
    if (idx >= 0) {
      onChange(atuais.filter((_, i) => i !== idx))
    } else {
      onChange([...atuais, { nome: cor.nome, codigo: cor.codigo }])
    }
  }

  return (
    <div className="bb-paleta">
      <p className="sub">
        Marque as cores que este produto tem. A lista e a paleta oficial da BB (o codigo
        de cada cor e o que vai para o CRM). A foto de cada cor continua sendo associada
        na lista abaixo.
      </p>
      {GRUPOS_CORES.map((grupo) => {
        const doGrupo = CORES_BB.filter((c) => c.grupo === grupo)
        if (doGrupo.length === 0) return null
        return (
          <div key={grupo} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.7, margin: '6px 0' }}>{grupo}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {doGrupo.map((cor) => {
                const marcada = estaMarcada(cor, atuais) >= 0
                return (
                  <button
                    key={cor.codigo}
                    type="button"
                    onClick={() => alternar(cor)}
                    disabled={disabled}
                    aria-pressed={marcada}
                    title={`${cor.codigo} ${cor.nome}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 10px 4px 6px',
                      borderRadius: 999,
                      cursor: disabled ? 'default' : 'pointer',
                      border: marcada ? '2px solid #16a34a' : '1px solid rgba(0,0,0,0.15)',
                      background: marcada ? 'rgba(22,163,74,0.08)' : '#fff',
                      fontSize: 12,
                      fontWeight: marcada ? 600 : 400,
                    }}
                  >
                    <Bolinha hex={cor.hex} />
                    <span>{cor.nome}</span>
                    {marcada ? <span aria-hidden style={{ color: '#16a34a' }}>&#10003;</span> : null}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
