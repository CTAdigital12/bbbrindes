// Sobe fotos LIMPAS do banco de imagens local (arquivos `<id>_<slug>.webp`, que
// sao as fotos de produto sem logo/texto; os arquivos SEM id sao composites de
// marketing e NAO entram aqui) para a collection `media` (Payload -> R2 via S3_*)
// e grava em `produtos.imagens`.
//
// Le um plano JSON: [{ cod, mode, folder, files[] }], onde:
//   - cod   = codigoSite do produto (chave unique)
//   - mode  = "set" (so se imagens estiver VAZIO) | "append" (so se tiver 1 foto)
//   - folder/files = pasta e arquivos limpos dentro de IMG_BASE
// Guardas de estado evitam duplicar se rodar de novo.
//
// Uso (na pasta backend/):
//   DRY:  IMG_PLAN="<abs>" IMG_BASE="<abs>" IMG_DRY=1 PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-imagens.ts
//   REAL: IMG_PLAN="<abs>" IMG_BASE="<abs>"           PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-imagens.ts

import { getPayload } from 'payload'
import config from '@payload-config'
import { readFileSync } from 'fs'
import path from 'path'

type PlanItem = { cod: string; mode: 'set' | 'append' | 'replace'; folder: string; files: string[] }

const planPath = process.env.IMG_PLAN
const baseDir = process.env.IMG_BASE
const DRY = process.env.IMG_DRY === '1'

const payload = await getPayload({ config })

// Modo PURGE: apaga media criada a partir de um instante (recuperacao de uploads
// que foram pro disco local em vez do R2). Use com railway run.
const purgeSince = process.env.IMG_PURGE_SINCE
if (purgeSince) {
  const { docs } = await payload.find({
    collection: 'media',
    where: { createdAt: { greater_than_equal: purgeSince } },
    depth: 0,
    limit: 2000,
  })
  payload.logger.info(`${DRY ? '[DRY] ' : ''}purge: ${docs.length} media desde ${purgeSince}`)
  let del = 0
  for (const m of docs as Array<{ id: string | number; filename?: string }>) {
    if (!DRY) {
      try {
        await payload.delete({ collection: 'media', id: m.id })
        del++
      } catch (e) {
        payload.logger.warn(`falha ao apagar media ${m.id} ${m.filename}: ${(e as Error).message}`)
      }
    }
  }
  payload.logger.info(`${DRY ? '[DRY] ' : ''}purge OK: ${DRY ? docs.length : del} apagadas`)
  process.exit(0)
}

if (!planPath || !baseDir) {
  console.error('Faltou IMG_PLAN (plano json) e/ou IMG_BASE (raiz das pastas de imagem).')
  process.exit(1)
}

const plan: PlanItem[] = JSON.parse(readFileSync(planPath, 'utf-8'))

// IDs de media sao NUMERICOS no Postgres: preserva o tipo cru (nao vira string).
const idsOf = (v: unknown): Array<string | number> => {
  if (!v) return []
  const arr = Array.isArray(v) ? v : [v]
  return arr.map((x) => (x && typeof x === 'object' ? (x as { id: string | number }).id : (x as string | number)))
}

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
    const prod = docs[0] as { id: string; nome?: string; imagens?: unknown }
    const existing = idsOf(prod.imagens)

    // Modo de manutencao: remove ids repetidos do array imagens (preserva ordem).
    if (process.env.IMG_DEDUPE === '1') {
      const uniq = [...new Set(existing)]
      if (uniq.length !== existing.length) {
        if (!DRY) await payload.update({ collection: 'produtos', id: prod.id, data: { imagens: uniq } })
        payload.logger.info(`${DRY ? '[DRY] ' : ''}${item.cod} dedupe: ${existing.length} -> ${uniq.length}`)
        done++
      } else {
        payload.logger.info(`${item.cod} sem dup (${existing.length})`)
      }
      continue
    }

    if (item.mode === 'set' && existing.length !== 0) {
      skipped.push(`${item.cod} (set: ja tem ${existing.length} img)`)
      continue
    }
    if (item.mode === 'append' && existing.length !== 1) {
      skipped.push(`${item.cod} (append: esperava 1 img, tem ${existing.length})`)
      continue
    }

    const noReuse = process.env.IMG_NO_REUSE === '1'
    const newIds: Array<string | number> = []
    let idx = 1
    for (const f of item.files) {
      const abs = path.join(baseDir, item.folder, f)
      // Reusa media ja existente pelo filename (idempotente; reaproveita uploads
      // de uma rodada anterior que falhou, sem duplicar no R2). Com IMG_NO_REUSE,
      // sempre cria de novo (usado quando o ARQUIVO mudou, ex. fundo removido).
      const found = noReuse
        ? { docs: [] as Array<{ id: string | number }> }
        : await payload.find({ collection: 'media', where: { filename: { equals: f } }, depth: 0, limit: 1 })
      if (found.docs.length) {
        newIds.push((found.docs[0] as { id: string | number }).id)
        payload.logger.info(`${DRY ? '[DRY] ' : ''}${item.cod} reusa media ${f}`)
        idx++
        continue
      }
      if (DRY) {
        payload.logger.info(`[DRY] ${item.cod} <- cria ${abs}`)
        idx++
        continue
      }
      const media = await payload.create({
        collection: 'media',
        data: { alt: `${prod.nome ?? item.cod} - foto ${idx}` },
        filePath: abs,
      })
      newIds.push((media as { id: string | number }).id)
      idx++
    }

    // append soma ao que ja existe; set/replace sobrescreve. Dedup por garantia.
    const finalIds = [...new Set(item.mode === 'append' ? [...existing, ...newIds] : newIds)]
    if (DRY) {
      const prevista = item.mode === 'append' ? existing.length + item.files.length : item.files.length
      payload.logger.info(`[DRY] ${item.cod} ${item.mode}: ${existing.length} -> ${prevista} imagens`)
      continue
    }
    await payload.update({ collection: 'produtos', id: prod.id, data: { imagens: finalIds } })
    payload.logger.info(`${item.cod} ${item.mode}: ${finalIds.length} imagens (subiu ${newIds.length})`)
    done++
  }

  payload.logger.info(`${DRY ? '[DRY RUN] ' : ''}OK. produtos atualizados: ${done} | pulados: ${skipped.length}`)
  if (skipped.length) payload.logger.info('pulados: ' + skipped.join(', '))
  process.exit(0)
} catch (err) {
  console.error('Falha no seed de imagens:', err)
  process.exit(1)
}
