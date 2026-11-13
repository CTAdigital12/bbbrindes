// Sobe a imagem de DIMENSOES/MEDIDAS (desenho com cotas) de cada produto para a
// collection `media` (Payload -> R2 via S3_*) e grava em `produtos.imagemDimensoes`
// (campo upload single, item C). E a imagem que o site abre no botao "Ver dimensoes"
// da PDP (PR #150). Diferente da imagemAmbientada (lifestyle). Origem: pasta Drive
// "Imagens com Medidas" do BANCO DE IMAGENS 2026 (MV01<cod> p/ base, MV02<cod> p/ G/GC),
// ja saneada (sem acento) em DIM_BASE.
//
// Le um plano JSON: [{ cod, file }], onde:
//   - cod  = codigoSite do produto (chave unique)
//   - file = nome do arquivo dentro de DIM_BASE
//
// Uso (na pasta backend/, com railway run por causa do S3_* do R2):
//   DRY:  DIM_PLAN="<abs>" DIM_BASE="<abs>" DIM_DRY=1 PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-dimensoes.ts
//   REAL: DIM_PLAN="<abs>" DIM_BASE="<abs>"           PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-dimensoes.ts
// Flags: DIM_DRY=1 (so loga) | DIM_OVERWRITE=1 (troca mesmo quem ja tem) | DIM_NO_REUSE=1 (sempre recria a media)

import { getPayload } from 'payload'
import config from '@payload-config'
import { readFileSync } from 'fs'
import path from 'path'

type PlanItem = { cod: string; file: string }

const planPath = process.env.DIM_PLAN
const baseDir = process.env.DIM_BASE
const DRY = process.env.DIM_DRY === '1'
const OVERWRITE = process.env.DIM_OVERWRITE === '1'
const NO_REUSE = process.env.DIM_NO_REUSE === '1'

if (!planPath || !baseDir) {
  console.error('Faltou DIM_PLAN (plano json) e/ou DIM_BASE (raiz dos arquivos).')
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
    const prod = docs[0] as { id: string; nome?: string; imagemDimensoes?: unknown }
    const atual = idOf(prod.imagemDimensoes)
    if (atual && !OVERWRITE) {
      skipped.push(`${item.cod} (ja tem dimensoes)`)
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
        data: { alt: `${prod.nome ?? item.cod} - dimensoes` },
        filePath: abs,
      })
      mediaId = (media as { id: string | number }).id
    }

    await payload.update({
      collection: 'produtos',
      id: prod.id,
      data: { imagemDimensoes: mediaId },
    })
    payload.logger.info(`${item.cod} dimensoes OK (media ${mediaId})`)
    done++
  }

  payload.logger.info(
    `${DRY ? '[DRY RUN] ' : ''}OK. produtos atualizados: ${done} | pulados: ${skipped.length}`,
  )
  if (skipped.length) payload.logger.info('pulados: ' + skipped.join(', '))
  process.exit(0)
} catch (err) {
  console.error('Falha no seed de dimensoes:', err)
  process.exit(1)
}
