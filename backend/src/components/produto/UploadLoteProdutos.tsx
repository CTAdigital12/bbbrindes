'use client'
import React from 'react'

// Item O (revisao Plinio 10/11 + pedido do Julien): botao "carregar produtos em lote"
// com um modelo (template) CSV vazio para baixar e preencher. Renderiza acima da lista
// de produtos (admin.components.beforeListTable).
//
// ESTADO: o download do modelo e o parse/preview do CSV estao FUNCIONAIS. A GRAVACAO em
// lote (criar os produtos de fato) esta deixada como STUB documentado: o preview mostra
// o que seria importado e valida o minimo, mas NAO chama a API ainda. Plugar o POST em
// /api/produtos (com dedupe por codigoSite) e o proximo passo. Ver comentario abaixo.

// Colunas do modelo. Uma linha por produto. Listas (categorias, cores) separadas por "|".
const COLUNAS = [
  'codigoSite',
  'codigoCigam',
  'nome',
  'categorias', // slugs separados por | (ex.: squeezes|ecologicos)
  'headline',
  'subtitulo',
  'descricaoCurta',
  'ecologico', // sim / nao
  'quantidadeMinima', // numero (ex.: 500)
  'faixaPreco', // ate-3-99 | 4-a-15 | acima-de-15
  'cores', // codigos da paleta separados por | (ex.: 02|03|12)
] as const

type Linha = Record<string, string>

// Parser CSV minimo: lida com aspas, virgula dentro de aspas e quebras \r\n.
function parseCSV(texto: string): string[][] {
  const linhas: string[][] = []
  let campo = ''
  let linha: string[] = []
  let dentroAspas = false
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i]
    if (dentroAspas) {
      if (c === '"') {
        if (texto[i + 1] === '"') {
          campo += '"'
          i++
        } else {
          dentroAspas = false
        }
      } else {
        campo += c
      }
    } else if (c === '"') {
      dentroAspas = true
    } else if (c === ',') {
      linha.push(campo)
      campo = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++
      linha.push(campo)
      campo = ''
      if (linha.some((v) => v.trim() !== '')) linhas.push(linha)
      linha = []
    } else {
      campo += c
    }
  }
  if (campo !== '' || linha.length > 0) {
    linha.push(campo)
    if (linha.some((v) => v.trim() !== '')) linhas.push(linha)
  }
  return linhas
}

function baixarModelo() {
  const conteudo = COLUNAS.join(',') + '\n'
  const blob = new Blob(['﻿' + conteudo], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'modelo-produtos-bb.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function UploadLoteProdutos() {
  const [aberto, setAberto] = React.useState(false)
  const [linhas, setLinhas] = React.useState<Linha[]>([])
  const [erros, setErros] = React.useState<string[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)

  function aoEscolherArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const matriz = parseCSV(String(reader.result ?? ''))
      const problemas: string[] = []
      if (matriz.length < 2) {
        setErros(['O arquivo precisa ter o cabecalho e pelo menos uma linha de produto.'])
        setLinhas([])
        return
      }
      const cabecalho = matriz[0].map((h) => h.trim())
      const faltando = COLUNAS.filter((c) => !cabecalho.includes(c))
      if (faltando.length > 0) problemas.push(`Colunas faltando no cabecalho: ${faltando.join(', ')}.`)
      const registros: Linha[] = matriz.slice(1).map((cols) => {
        const linha: Linha = {}
        cabecalho.forEach((h, i) => (linha[h] = (cols[i] ?? '').trim()))
        return linha
      })
      registros.forEach((r, i) => {
        if (!r.codigoSite) problemas.push(`Linha ${i + 2}: codigoSite vazio (obrigatorio).`)
        if (!r.nome) problemas.push(`Linha ${i + 2}: nome vazio (obrigatorio).`)
      })
      setErros(problemas)
      setLinhas(registros)
    }
    reader.readAsText(file)
  }

  function importar() {
    // STUB documentado: aqui entraria o POST em lote para /api/produtos (uma chamada
    // por linha ou um endpoint custom de import), com dedupe por codigoSite e
    // tratamento de erro por linha. Mantido como stub para nao criar produtos reais
    // sem o endpoint de import revisado. O preview acima ja prova o parse e a validacao.
    alert(
      `Pre-visualizacao: ${linhas.length} produto(s) prontos para importar. A gravacao em ` +
        `lote ainda e um stub (falta plugar o endpoint de import). Nenhum produto foi criado.`,
    )
  }

  return (
    <div style={{ margin: '8px 0 16px' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button type="button" className="btn btn--style-secondary" onClick={() => setAberto((v) => !v)}>
          Carregar produtos em lote
        </button>
        <button type="button" className="btn btn--style-secondary" onClick={baixarModelo}>
          Baixar modelo (CSV)
        </button>
      </div>
      {aberto ? (
        <div
          style={{
            marginTop: 10,
            padding: 12,
            border: '1px solid rgba(0,0,0,0.15)',
            borderRadius: 8,
            maxWidth: 720,
          }}
        >
          <p className="sub" style={{ marginTop: 0 }}>
            1. Baixe o modelo, preencha uma linha por produto (listas separadas por barra,
            ex.: cores <code>02|03|12</code>). 2. Escolha o arquivo preenchido para
            pre-visualizar e validar.
          </p>
          <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={aoEscolherArquivo} />
          {erros.length > 0 ? (
            <ul style={{ color: '#b91c1c', marginTop: 10 }}>
              {erros.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          ) : null}
          {linhas.length > 0 ? (
            <>
              <p style={{ marginTop: 10 }}>
                <strong>{linhas.length}</strong> produto(s) lido(s) do arquivo:
              </p>
              <ul style={{ maxHeight: 180, overflow: 'auto', fontSize: 13 }}>
                {linhas.slice(0, 50).map((l, i) => (
                  <li key={i}>
                    {l.codigoSite} - {l.nome || '(sem nome)'}
                    {l.cores ? ` (cores: ${l.cores})` : ''}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="btn btn--style-primary"
                disabled={erros.length > 0}
                onClick={importar}
              >
                Importar {linhas.length} produto(s)
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
