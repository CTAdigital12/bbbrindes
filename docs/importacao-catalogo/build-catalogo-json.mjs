#!/usr/bin/env node
// Pre-processador do catalogo (versao Node, planilha 12_10.2026).
//
// Substitui o build-catalogo-json.py: a planilha nova (12_10) NAO tem mais a aba
// "Especificacoes" (que o .py lia); a fonte agora e a aba "PRODUTOS EM LINHA",
// com outro layout de colunas (codigoSite=10, selos=27..39, cores=57..102 etc).
// Node porque o python nao esta no PATH deste ambiente; o parser de CSV abaixo
// trata aspas, aspas escapadas ("") e quebras de linha dentro da celula.
//
// Emite o mesmo JSON que backend/src/seed/catalogo.ts consome, com DOIS campos
// novos que a planilha 12_10 traz e o schema ja tem: `headline` e
// `argumentoComercial` (para o seed gravar, ver edicao no catalogo.ts).
//
// `especificacoes` (tabela da PDP) e SINTETIZADA dos campos estruturados de
// logistica/impressao, ja que a planilha 12_10 nao tem mais a celula unica.
//
// Uso:
//   node build-catalogo-json.mjs ["<CSV>"] ["<JSON de saida>"]
// Padroes: CSV = _catalogo-12_10/planilha/aba-PRODUTOS-EM-LINHA.csv
//          JSON = backend/src/seed/data/catalogo.json

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.resolve(HERE, '..', '..')
const DEFAULT_CSV = path.join(REPO, '_catalogo-12_10', 'planilha', 'aba-PRODUTOS-EM-LINHA.csv')
const DEFAULT_OUT = path.join(REPO, 'backend', 'src', 'seed', 'data', 'catalogo.json')

const CSV_PATH = process.argv[2] || DEFAULT_CSV
const OUT_PATH = process.argv[3] || DEFAULT_OUT

// --- CSV parser robusto (aspas, "" escapado, \n dentro da celula) ---
function parseCSV(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)
  const rows = []
  let row = [], field = '', inQ = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++ } else inQ = false }
      else field += c
    } else if (c === '"') inQ = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\r') { /* skip */ }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else field += c
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  return rows
}

// --- indices de coluna (aba PRODUTOS EM LINHA, header real = linha 1, dados a partir da 2) ---
const C = {
  site: 0, tabelaRevenda: 8, tabelaB2B: 9,
  codigoSite: 10, codigoCigam: 11, nome: 12, subtitulo: 13, headline: 14,
  descricaoCurta: 15, descricaoCompleta: 16, beneficios: 17, idealPara: 18,
  diferenciais: 19, palavrasChave: 20, metaDescription: 21, argumentoComercial: 22,
  cat1: 23, cat2: 24, cat3: 25, ecologico: 26,
  ncm: 40, dimensoes: 41, pesoUnitario: 42, materiaPrima: 43,
  modeloCaixaMaster: 44, qtdPorCaixa: 45, dimensoesCaixaMaster: 46, pesoCaixaMaster: 47,
  metodos: 48, areaTransfer: 49, areaTampografia: 50, areaSerigrafia: 51, sleeve: 52,
}
// selos: coluna -> chave do grupo `selos` (13 icones, cols 27..39)
const SELOS = {
  27: 'livreDeBpa', 28: 'usoMicroondas', 29: 'usoLavaLoucas', 30: 'recicladoTotal',
  31: 'logisticaReversa', 32: 'usoPermanente', 33: 'reducaoCo2', 34: 'fonteRenovavel',
  35: 'designCircular', 36: 'upcycling', 37: 'fibraNatural', 38: 'reciclavel', 39: 'reducaoPlastico',
}

const NEGATIVOS = new Set(['', 'NAO', 'N', '-', '0', 'X-', 'FALSE', 'N/A', 'NA', 'NAO SE APLICA', 'NÃO SE APLICA'])

const stripAcentos = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')
const slugify = (s) => stripAcentos(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const normCat = (s) => stripAcentos(s).toLowerCase().replace(/[^a-z0-9]/g, '')

// nome de categoria (normalizado) -> slug da collection categorias
const CAT_MAP = {
  greenfibras: 'green-fibras',
  greenplasticaria: 'green-plasticaria',
  medalhasetrofeus: 'medalhas-trofeus',
  infantil: 'infantil',
  canecasexicaras: 'canecas-xicaras',
  bowlsbaldesepotes: 'bowls-potes',
  togoviagem: 'to-go-viagem',
  escritorio: 'escritorio',
  copos: 'copos',
  casaedecoracao: 'casa-decoracao',
  squeezes: 'squeezes',
  chaveiros: 'chaveiros',
  inmoldlabel: 'in-mold-label',
  cordoesecosturados: 'cordoes-costurados',
  projetosespeciais: 'projetos-especiais',
}

const cellRaw = (row, key) => { const i = C[key]; return i != null && row.length > i ? row[i] : '' }
const cell = (row, key) => cellRaw(row, key).trim()
const truthy = (v) => { const t = stripAcentos(String(v)).trim().toUpperCase(); return t !== '' && !NEGATIVOS.has(t) }
const meaningful = (v) => truthy(v) && v.trim() !== '' // valor util p/ ficha (nao "N/A")

const listaPorLinha = (v) =>
  v.split(/\r?\n/).map((s) => s.trim()).filter((t) => t && /[0-9A-Za-zÀ-ÿ]/.test(t))

const paragrafos = (v) => v.split(/\r?\n\s*\r?\n|\r?\n/).map((p) => p.trim()).filter(Boolean)

const qtd = (v) => { const m = v.replace(/[.,]/g, '').match(/\d+/); return m ? parseInt(m[0], 10) : null }

function catSlugs(row, warn) {
  const slugs = []
  for (const k of ['cat1', 'cat2', 'cat3']) {
    const nome = cell(row, k)
    if (!nome) continue
    const slug = CAT_MAP[normCat(nome)]
    if (slug === undefined) { warn.push(`categoria nao mapeada: ${JSON.stringify(nome)} (produto ${cell(row, 'codigoSite')})`); continue }
    if (!slugs.includes(slug)) slugs.push(slug)
  }
  return slugs
}

// Sintetiza a tabela de especificacoes (PDP) a partir dos campos estruturados
// da planilha 12_10. Rotulos alinhados ao estilo que ja estava em producao.
function sintetizarEspecificacoes(row) {
  const pares = []
  const add = (rotulo, key) => { const v = cell(row, key); if (meaningful(v)) pares.push({ rotulo, valor: v.replace(/\r?\n/g, ' ').trim() }) }
  add('Matéria prima', 'materiaPrima')
  add('Dimensões', 'dimensoes')
  add('Peso unitário', 'pesoUnitario')
  add('Métodos de impressão', 'metodos')
  add('Área de impressão (transfer)', 'areaTransfer')
  add('Área de impressão (tampografia)', 'areaTampografia')
  add('Área de impressão (serigrafia)', 'areaSerigrafia')
  add('Sleeve', 'sleeve')
  add('Quantidade por caixa', 'qtdPorCaixa')
  add('NCM', 'ncm')
  return pares
}

function main() {
  const text = readFileSync(CSV_PATH, 'utf8')
  const rows = parseCSV(text)
  const data = rows.slice(2) // header real = linha 1; dados a partir da linha 2
  const prods = data.filter((r) => r.length > 12 && cell(r, 'codigoSite') && cell(r, 'nome'))
  const siteOk = prods.filter((r) => cell(r, 'site').toLowerCase() === 'ok')

  const warn = []
  const seenSlug = {}
  const seenCodigo = new Set()
  const out = []

  for (const r of siteOk) {
    const codigo = cell(r, 'codigoSite')
    if (seenCodigo.has(codigo)) { warn.push(`codigoSite duplicado, pulando 2a ocorrencia: ${codigo}`); continue }
    seenCodigo.add(codigo)

    const nome = cell(r, 'nome')
    let slug = slugify(nome)
    if (slug in seenSlug && seenSlug[slug] !== codigo) { slug = `${slug}-${slugify(codigo)}`; warn.push(`slug colidiu, desambiguado para ${slug} (produto ${codigo})`) }
    seenSlug[slug] = codigo

    const cats = catSlugs(r, warn)
    if (cats.length === 0) { warn.push(`SEM categoria valida, pulando produto ${codigo} (${nome})`); continue }

    const selos = {}
    for (const [ci, chave] of Object.entries(SELOS)) { const v = r.length > ci ? r[ci].trim() : ''; if (truthy(v)) selos[chave] = true }

    out.push({
      codigoSite: codigo,
      codigoCigam: cell(r, 'codigoCigam') || null,
      nome,
      slug,
      subtitulo: cell(r, 'subtitulo') || null,
      headline: cell(r, 'headline') || null,
      descricaoCurta: cell(r, 'descricaoCurta') || null,
      descricaoCompletaParagrafos: paragrafos(cell(r, 'descricaoCompleta')),
      beneficios: listaPorLinha(cell(r, 'beneficios')),
      idealPara: listaPorLinha(cell(r, 'idealPara')),
      diferenciais: listaPorLinha(cell(r, 'diferenciais')),
      especificacoes: sintetizarEspecificacoes(r),
      argumentoComercial: cell(r, 'argumentoComercial') || null,
      categorias: cats,
      ecologico: truthy(cell(r, 'ecologico')),
      selos,
      seo: {
        titleTag: null, // planilha 12_10 nao tem coluna titleTag
        metaDescription: cell(r, 'metaDescription') || null,
        palavrasChave: cell(r, 'palavrasChave').split(',').map((t) => t.trim()).filter(Boolean),
        altTextPrincipal: null, // planilha 12_10 nao tem coluna altText
      },
      logistica: {
        ncm: cell(r, 'ncm') || null,
        dimensoes: cell(r, 'dimensoes') || null,
        pesoUnitario: cell(r, 'pesoUnitario') || null,
        materiaPrima: cell(r, 'materiaPrima') || null,
        modeloCaixaMaster: cell(r, 'modeloCaixaMaster') || null,
        qtdPorCaixa: qtd(cell(r, 'qtdPorCaixa')),
        dimensoesCaixaMaster: cell(r, 'dimensoesCaixaMaster') || null,
        pesoCaixaMaster: cell(r, 'pesoCaixaMaster') || null,
      },
      impressao: {
        metodos: cell(r, 'metodos') || null,
        areaTransfer: cell(r, 'areaTransfer') || null,
        areaTampografia: cell(r, 'areaTampografia') || null,
        areaSerigrafia: cell(r, 'areaSerigrafia') || null,
        sleeve: cell(r, 'sleeve') || null,
      },
      canais: {
        site: cell(r, 'site').toLowerCase() === 'ok',
        tabelaRevenda: cell(r, 'tabelaRevenda').toLowerCase() === 'ok',
        tabelaB2B: cell(r, 'tabelaB2B').toLowerCase() === 'ok',
      },
    })
  }

  mkdirSync(path.dirname(OUT_PATH), { recursive: true })
  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf8')

  console.log(`CSV:  ${CSV_PATH}`)
  console.log(`JSON: ${OUT_PATH}`)
  console.log(`produtos no CSV: ${prods.length} | SITE=ok: ${siteOk.length} | exportados: ${out.length}`)
  console.log(`sem beneficios: ${out.filter((p) => !p.beneficios.length).length}`)
  console.log(`sem especificacoes: ${out.filter((p) => !p.especificacoes.length).length}`)
  console.log(`sem headline: ${out.filter((p) => !p.headline).length}`)
  console.log(`sem argumentoComercial: ${out.filter((p) => !p.argumentoComercial).length}`)
  console.log(`ecologicos: ${out.filter((p) => p.ecologico).length}`)
  console.log(`avisos (${warn.length}):`)
  for (const w of warn) console.log(`  - ${w}`)
}

main()
