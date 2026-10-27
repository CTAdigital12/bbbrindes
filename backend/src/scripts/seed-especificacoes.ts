// Monta a tabela de ESPECIFICACOES da PDP (campo `especificacoes`, array
// {rotulo, valor}) a partir do que JA existe no produto: grupos `logistica` e
// `impressao` + a capacidade extraida do nome. O front (produtos.ts) le
// `especificacoes` direto, e hoje so 1/155 esta preenchido -> a tabela aparece
// vazia nas outras PDPs. Este script apenas MONTA a tabela do dado existente;
// nao inventa nem puxa da planilha.
//
// Uso (na pasta backend/; roda contra o Supabase do .env, aquecer antes):
//   DRY:  ESPEC_DRY=1 PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-especificacoes.ts
//   REAL:            PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-especificacoes.ts
// Flags: ESPEC_DRY=1 (so loga) | ESPEC_ONLY_EMPTY=1 (pula quem ja tem tabela) |
//        ESPEC_COD=<codigoSite> (um so) | ESPEC_OVERWRITE=1 (refaz mesmo quem ja tem) |
//        ESPEC_SKIP=109,outro (nao toca nesses codigos).

import { getPayload } from 'payload'
import config from '@payload-config'

const DRY = process.env.ESPEC_DRY === '1'
const ONLY_EMPTY = process.env.ESPEC_ONLY_EMPTY === '1'
const OVERWRITE = process.env.ESPEC_OVERWRITE === '1'
const COD = process.env.ESPEC_COD
// codigos a NAO tocar (ex: 109 ja curado a mao, com linhas extras)
const SKIP = (process.env.ESPEC_SKIP || '').split(',').map((s) => s.trim()).filter(Boolean)

const payload = await getPayload({ config })

type Esp = { rotulo: string; valor: string }

const vazio = (v: unknown): boolean => {
  if (v == null) return true
  const s = String(v).trim().toLowerCase()
  if (s === '') return true
  // tira acento ("nao"/"nã") e compara
  const norm = s.normalize('NFD').replace(/[̀-ͯ]/g, '')
  return /^(n\/?a|n\.a\.?|nao se aplica|-+)$/.test(norm)
}

const capacidadeDoNome = (nome: string): string | null => {
  // "550ml" / "300 mL" / "2,6L" / "2.6 litros"
  const m = nome.match(/(\d+(?:[.,]\d+)?)\s*(ml|mL|L|litros?)\b/i)
  if (!m) return null
  const num = m[1]
  const un = /l/i.test(m[2]) && !/ml/i.test(m[2]) ? 'L' : 'mL'
  return `${num} ${un}`
}

const montar = (p: {
  nome?: string
  logistica?: Record<string, unknown>
  impressao?: Record<string, unknown>
}): Esp[] => {
  const L = p.logistica ?? {}
  const I = p.impressao ?? {}
  const esp: Esp[] = []
  const add = (rotulo: string, valor: unknown) => {
    if (!vazio(valor)) esp.push({ rotulo, valor: String(valor).trim() })
  }
  add('Material', L.materiaPrima)
  const cap = capacidadeDoNome(p.nome ?? '')
  if (cap) esp.push({ rotulo: 'Capacidade', valor: cap })
  add('Dimensões', L.dimensoes)
  add('Peso unitário', L.pesoUnitario)
  add('Impressão', I.metodos)
  add('Área de impressão (transfer)', I.areaTransfer)
  add('Área de impressão (tampografia)', I.areaTampografia)
  add('Área de impressão (serigrafia)', I.areaSerigrafia)
  return esp
}

try {
  const where = COD ? { codigoSite: { equals: COD } } : {}
  const { docs } = await payload.find({ collection: 'produtos', where, depth: 0, limit: 1000 })
  payload.logger.info(`${DRY ? '[DRY] ' : ''}produtos: ${docs.length}`)

  let done = 0
  let pulados = 0
  const semDado: string[] = []

  for (const p of docs as Array<{
    id: string | number
    codigoSite?: string
    nome?: string
    especificacoes?: unknown[]
    logistica?: Record<string, unknown>
    impressao?: Record<string, unknown>
  }>) {
    if (SKIP.includes(String(p.codigoSite))) {
      pulados++
      continue
    }
    const jaTem = Array.isArray(p.especificacoes) && p.especificacoes.length > 0
    if (jaTem && ONLY_EMPTY && !OVERWRITE) {
      pulados++
      continue
    }
    if (jaTem && !OVERWRITE && !ONLY_EMPTY) {
      // por padrao, so preenche quem esta vazio (nao mexe no que ja foi curado)
      pulados++
      continue
    }
    const esp = montar(p)
    if (esp.length === 0) {
      semDado.push(String(p.codigoSite))
      continue
    }
    if (DRY) {
      payload.logger.info(
        `[DRY] ${p.codigoSite} (${esp.length} linhas): ${esp.map((e) => e.rotulo).join(', ')}`,
      )
      done++
      continue
    }
    await payload.update({ collection: 'produtos', id: p.id, data: { especificacoes: esp } })
    done++
  }

  payload.logger.info(
    `${DRY ? '[DRY RUN] ' : ''}OK. preenchidos: ${done} | pulados(ja tinham): ${pulados} | sem dado p/ montar: ${semDado.length}`,
  )
  if (semDado.length) payload.logger.info('sem dado: ' + semDado.join(', '))
  process.exit(0)
} catch (err) {
  console.error('Falha no seed de especificacoes:', err)
  process.exit(1)
}
