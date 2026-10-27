// Sobe a imagem LIFESTYLE/ambientada (conceitual, com a marca aplicada) de cada
// produto para a collection `media` (Payload -> R2 via S3_*) e grava em
// `produtos.imagemAmbientada` (campo upload single). E a imagem que o card
// revela no HOVER (slot .alt full-bleed). Origem: pasta Drive "Imagens
// Conceituais" (1hA88), baixada e convertida pra webp em IMG_BASE.
//
// Le um plano JSON: [{ cod, file }], onde:
//   - cod  = codigoSite do produto (chave unique)
//   - file = nome do arquivo (webp) dentro de IMG_BASE
//
// Uso (na pasta backend/, com railway run por causa do S3_* do R2):
//   DRY:  AMB_PLAN="<abs>" AMB_BASE="<abs>" AMB_DRY=1 PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-ambientada.ts
//   REAL: AMB_PLAN="<abs>" AMB_BASE="<abs>"           PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-ambientada.ts
// Flags: AMB_DRY=1 (so loga) | AMB_OVERWRITE=1 (troca mesmo quem ja tem) | AMB_NO_REUSE=1 (sempre recria a media)

import { getPayload } from 'payload'
import config from '@payload-config'
import { readFileSync } from 'fs'
import path from 'path'

type PlanItem = { cod: string; file: string }

const planPath = process.env.AMB_PLAN
const baseDir = process.env.AMB_BASE
const DRY = process.env.AMB_DRY === '1'
const OVERWRITE = process.env.AMB_OVERWRITE === '1'
const NO_REUSE = process.env.AMB_NO_REUSE === '1'

if (!planPath || !baseDir) {
  console.error('Faltou AMB_PLAN (plano json) e/ou AMB_BASE (raiz dos arquivos).')
  process.exit(1)
}

const payload = await getPayload({ config })
const plan: PlanItem[] = JSON.parse(readFileSync(planPath, 'utf-8'))

const idOf = (v: unknown): string | number | null =>
  !v ? null : typeof v === 'object' ? (v as { id: string | number }).id : (v as string | number)

try {
  let done = 0
  const skipped: string[] = []

  for (const item of plan) {
    const { docs } = await payload.find({
      collection: 'produtos',
      where: { codigoSite: { equals: item.cod } },
      depth: 0,
      limit: 1,
    })
    if (!docs.length) {
      skipped.push(`${item.cod} (produto nao encontrado)`)
      continue
    }
    const prod = docs[0] as { id: string; nome?: string; imagemAmbientada?: unknown }
    const atual = idOf(prod.imagemAmbientada)
    if (atual && !OVERWRITE) {
      skipped.push(`${item.cod} (ja tem ambientada)`)
      continue
    }

    // Reusa media ja existente pelo filename (idempotente); senao cria.
    const abs = path.join(baseDir, item.file)
    let mediaId: string | number | null = null
    if (!NO_REUSE) {
      const found = await payload.find({
        collection: 'media',
        where: { filename: { equals: item.file } },
        depth: 0,
        limit: 1,
      })
      if (found.docs.length) mediaId = (found.docs[0] as { id: string | number }).id
    }

    if (DRY) {
      payload.logger.info(
        `[DRY] ${item.cod} <- ${mediaId ? `reusa media ${item.file}` : `cria ${abs}`}`,
      )
      done++
      continue
    }

    if (!mediaId) {
      const media = await payload.create({
        collection: 'media',
        data: { alt: `${prod.nome ?? item.cod} - ambientada` },
        filePath: abs,
      })
      mediaId = (media as { id: string | number }).id
    }

    await payload.update({
      collection: 'produtos',
      id: prod.id,
      data: { imagemAmbientada: mediaId },
    })
    payload.logger.info(`${item.cod} ambientada OK (media ${mediaId})`)
    done++
  }

  payload.logger.info(
    `${DRY ? '[DRY RUN] ' : ''}OK. produtos atualizados: ${done} | pulados: ${skipped.length}`,
  )
  if (skipped.length) payload.logger.info('pulados: ' + skipped.join(', '))
  process.exit(0)
} catch (err) {
  console.error('Falha no seed de ambientada:', err)
  process.exit(1)
}
