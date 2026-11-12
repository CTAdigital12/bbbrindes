'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { corPorCodigo } from './cores-bb'

// Item O (revisao Plinio 10/11 + pedido do Julien): botao "carregar produtos em lote"
// com um modelo (template) CSV vazio para baixar e preencher. Renderiza acima da lista
// de produtos (admin.components.beforeListTable).
//
// GRAVACAO: create-only. Cada linha vira um POST em /api/produtos (REST do Payload, com
// o cookie de sessao do admin). Se o codigoSite da linha JA existe, a linha e PULADA
// (nunca sobrescreve) e aparece num aviso com link para o produto existente. Erros de
// criacao sao reportados por linha. Dedupe por codigoSite.

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
type Pulado = { codigoSite: string; nome: string; id: string | number }
type Criado = { codigoSite: string; nome: string; id?: string | number }
type Falha = { codigoSite: string; nome: string; msg: string }
type Resultado = { criados: Criado[]; pulados: Pulado[]; falhas: Falha[] }

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

// Link para a tela de edicao de um produto existente (rota padrao do Payload).
function urlProduto(id: string | number): string {
  return `/admin/collections/produtos/${id}`
}

export default function UploadLoteProdutos({ children }: { children?: React.ReactNode }) {
  const [aberto, setAberto] = React.useState(false)
  const [linhas, setLinhas] = React.useState<Linha[]>([])
  const [erros, setErros] = React.useState<string[]>([])
  const [importando, setImportando] = React.useState(false)
  const [resultado, setResultado] = React.useState<Resultado | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()

  function aoEscolherArquivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setResultado(null)
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

  // Monta o corpo do POST a partir de uma linha do CSV.
  function montarCorpo(r: Linha, catBySlug: Map<string, string | number>) {
    const catIds = (r.categorias || '')
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((slug) => catBySlug.get(slug))
      .filter((v): v is string | number => v !== undefined)
    const cores = (r.cores || '')
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((codigo) => {
        const c = corPorCodigo(codigo)
        return c ? { nome: c.nome, codigo: c.codigo } : null
      })
      .filter((v): v is { nome: string; codigo: string } => v !== null)
    const corpo: Record<string, unknown> = {
      codigoSite: r.codigoSite,
      nome: r.nome,
      categorias: catIds,
      ecologico: /^sim$/i.test(r.ecologico || ''),
      cores,
    }
    if (r.codigoCigam) corpo.codigoCigam = r.codigoCigam
    if (r.headline) corpo.headline = r.headline
    if (r.subtitulo) corpo.subtitulo = r.subtitulo
    if (r.descricaoCurta) corpo.descricaoCurta = r.descricaoCurta
    if (r.quantidadeMinima && !Number.isNaN(Number(r.quantidadeMinima)))
      corpo.quantidadeMinima = Number(r.quantidadeMinima)
    if (r.faixaPreco) corpo.faixaPreco = r.faixaPreco
    return corpo
  }

  async function importar() {
    setImportando(true)
    setResultado(null)
    setErros([])
    try {
      // 1. produtos que ja existem (dedupe por codigoSite): pega id + codigoSite.
      const existRes = await fetch('/api/produtos?limit=0&depth=0', { credentials: 'include' })
      if (!existRes.ok) throw new Error(`Nao consegui ler os produtos atuais (HTTP ${existRes.status}).`)
      const existJson = await existRes.json()
      const mapaExistente = new Map<string, string | number>()
      for (const d of existJson?.docs ?? []) {
        if (d?.codigoSite) mapaExistente.set(String(d.codigoSite), d.id)
      }

      // 2. categorias por slug -> id (relationship obrigatorio no produto).
      const catRes = await fetch('/api/categorias?limit=0&depth=0', { credentials: 'include' })
      const catJson = catRes.ok ? await catRes.json() : { docs: [] }
      const catBySlug = new Map<string, string | number>()
      for (const c of catJson?.docs ?? []) {
        if (c?.slug) catBySlug.set(String(c.slug), c.id)
      }

      // 3. uma linha por vez: pula existente, cria nova, reporta erro por linha.
      const criados: Criado[] = []
      const pulados: Pulado[] = []
      const falhas: Falha[] = []
      for (const r of linhas) {
        const cod = String(r.codigoSite)
        if (mapaExistente.has(cod)) {
          pulados.push({ codigoSite: cod, nome: r.nome, id: mapaExistente.get(cod)! })
          continue
        }
        try {
          const res = await fetch('/api/produtos', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(montarCorpo(r, catBySlug)),
          })
          if (!res.ok) {
            const j = await res.json().catch(() => ({}))
            const msg =
              j?.errors?.[0]?.message || j?.errors?.[0]?.data?.[0]?.message || j?.message || `HTTP ${res.status}`
            throw new Error(msg)
          }
          const j = await res.json()
          criados.push({ codigoSite: cod, nome: r.nome, id: j?.doc?.id })
          // adiciona ao mapa pra pegar duplicata dentro do proprio arquivo.
          if (j?.doc?.id != null) mapaExistente.set(cod, j.doc.id)
        } catch (e) {
          falhas.push({ codigoSite: cod, nome: r.nome, msg: (e as Error).message })
        }
      }
      setResultado({ criados, pulados, falhas })
      // Atualiza os dados do servidor (lista de produtos) sem recarregar a pagina,
      // preservando o painel de resultado. So vale a pena se algo foi criado.
      if (criados.length > 0) router.refresh()
    } catch (e) {
      setErros([`Falha ao importar: ${(e as Error).message}`])
    } finally {
      setImportando(false)
    }
  }

  return (
    <>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="btn btn--style-secondary" onClick={() => setAberto((v) => !v)}>
          Carregar produtos em lote
        </button>
        <button type="button" className="btn btn--style-secondary" onClick={baixarModelo}>
          Baixar modelo (CSV)
        </button>
        {children}
      </div>
      {aberto ? (
        <div
          style={{
            flexBasis: '100%',
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
            pre-visualizar e validar. 3. Importar cria os novos e pula os que ja existem
            (pelo codigo do site).
          </p>
          <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={aoEscolherArquivo} disabled={importando} />
          {erros.length > 0 ? (
            <ul style={{ color: '#b91c1c', marginTop: 10 }}>
              {erros.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          ) : null}
          {linhas.length > 0 && !resultado ? (
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
                disabled={erros.length > 0 || importando}
                onClick={importar}
              >
                {importando ? 'Importando...' : `Importar ${linhas.length} produto(s)`}
              </button>
            </>
          ) : null}

          {resultado ? (
            <div style={{ marginTop: 12 }}>
              <p style={{ margin: '0 0 8px' }}>
                <strong>{resultado.criados.length}</strong> criado(s),{' '}
                <strong>{resultado.pulados.length}</strong> pulado(s),{' '}
                <strong>{resultado.falhas.length}</strong> com erro.
              </p>

              {resultado.pulados.length > 0 ? (
                <div
                  style={{
                    marginTop: 8,
                    padding: 10,
                    border: '1px solid #f59e0b',
                    background: '#fffbeb',
                    borderRadius: 8,
                  }}
                >
                  <strong style={{ color: '#92400e' }}>
                    {resultado.pulados.length} produto(s) ja existiam e foram pulados (nao sobrescritos).
                  </strong>
                  <p style={{ margin: '4px 0 8px', fontSize: 13, color: '#92400e' }}>
                    Clique para abrir cada um:
                  </p>
                  <ul style={{ maxHeight: 200, overflow: 'auto', fontSize: 13, margin: 0 }}>
                    {resultado.pulados.map((p, i) => (
                      <li key={i}>
                        <a href={urlProduto(p.id)} target="_blank" rel="noreferrer">
                          {p.codigoSite} - {p.nome || '(sem nome)'}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {resultado.falhas.length > 0 ? (
                <div style={{ marginTop: 8 }}>
                  <strong style={{ color: '#b91c1c' }}>Linhas com erro:</strong>
                  <ul style={{ maxHeight: 160, overflow: 'auto', fontSize: 13, color: '#b91c1c', margin: '4px 0 0' }}>
                    {resultado.falhas.map((f, i) => (
                      <li key={i}>
                        {f.codigoSite} - {f.nome || '(sem nome)'}: {f.msg}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <button
                type="button"
                className="btn btn--style-secondary"
                style={{ marginTop: 10 }}
                onClick={() => {
                  setResultado(null)
                  setLinhas([])
                  if (inputRef.current) inputRef.current.value = ''
                }}
              >
                Importar outro arquivo
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
