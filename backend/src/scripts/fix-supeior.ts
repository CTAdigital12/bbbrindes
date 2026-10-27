// Corrige o typo "Supeior" -> "Superior" no dado-fonte dos produtos.
// O typo veio da planilha mestra (campos de area de impressao) e esta no grupo
// `impressao` + foi copiado pra tabela `especificacoes` pelo seed. Este script
// troca a string nos dois lugares, in-place, so em quem tem o typo.
//
// Uso (na pasta backend/, contra o Supabase do .env; aquecer antes):
//   DRY:  SUP_DRY=1 PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/fix-supeior.ts
//   REAL:         PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/fix-supeior.ts

import { getPayload } from 'payload'
import config from '@payload-config'

const DRY = process.env.SUP_DRY === '1'
const TYPO = 'Supeior'
const FIX = 'Superior'

const payload = await getPayload({ config })

const fixStr = (v: unknown): { v: unknown; hit: boolean } => {
  if (typeof v === 'string' && v.includes(TYPO)) {
    return { v: v.split(TYPO).join(FIX), hit: true }
  }
  return { v, hit: false }
}

try {
  const { docs } = await payload.find({ collection: 'produtos', depth: 0, limit: 1000 })
  payload.logger.info(`${DRY ? '[DRY] ' : ''}produtos: ${docs.length}`)

  let tocados = 0
  for (const p of docs as Array<{
    id: string | number
    codigoSite?: string
    impressao?: Record<string, unknown>
    especificacoes?: Array<{ rotulo?: string; valor?: string }>
  }>) {
    let hit = false
    const data: Record<string, unknown> = {}

    // grupo impressao
    if (p.impressao && typeof p.impressao === 'object') {
      const imp: Record<string, unknown> = { ...p.impressao }
      for (const k of Object.keys(imp)) {
        const r = fixStr(imp[k])
        if (r.hit) {
          imp[k] = r.v
          hit = true
        }
      }
      if (hit) data.impressao = imp
    }

    // tabela especificacoes (campo valor)
    if (Array.isArray(p.especificacoes)) {
      let espHit = false
      const esp = p.especificacoes.map((e) => {
        const r = fixStr(e?.valor)
        if (r.hit) espHit = true
        return r.hit ? { ...e, valor: r.v as string } : e
      })
      if (espHit) {
        data.especificacoes = esp
        hit = true
      }
    }

    if (!hit) continue
    tocados++
    if (DRY) {
      payload.logger.info(`[DRY] ${p.codigoSite}: corrigiria ${Object.keys(data).join(', ')}`)
      continue
    }
    await payload.update({ collection: 'produtos', id: p.id, data })
    payload.logger.info(`OK ${p.codigoSite}: ${Object.keys(data).join(', ')}`)
  }

  payload.logger.info(`${DRY ? '[DRY RUN] ' : ''}FIM. tocados: ${tocados}`)
  process.exit(0)
} catch (err) {
  console.error('Falha no fix-supeior:', err)
  process.exit(1)
}
