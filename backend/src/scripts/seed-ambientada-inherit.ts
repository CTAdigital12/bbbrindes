// Preenche imagemAmbientada de VARIANTES (Cristal / cores) reusando a imagem do
// produto IRMAO base que ja tem ambientada. A cena lifestyle e a mesma do mesmo
// produto; a variante so muda material/cor. DB-only (so reaponta pro media que ja
// existe no R2), NAO precisa de railway/login/upload.
//
// Agrupa por nome normalizado (sem material/cor/eco; mantem tamanho). Para cada
// produto SEM ambientada, se algum irmao do grupo TEM, copia o id do media.
//
// Uso (na pasta backend/):
//   DRY:  AMB_DRY=1 PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-ambientada-inherit.ts
//   REAL:          PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-ambientada-inherit.ts

import { getPayload } from 'payload'
import config from '@payload-config'

const DRY = process.env.AMB_DRY === '1'
const payload = await getPayload({ config })

const idOf = (v: unknown): string | number | null =>
  !v ? null : typeof v === 'object' ? (v as { id: string | number }).id : (v as string | number)

// chave base: tira material/eco/cor; mantem numeros (tamanho) pra nao fundir 300 com 550
const baseKey = (nome: string): string =>
  String(nome || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\b(cristal|ecologico|ecologica|green|fibras|plasticaria|colors?|premium)\b/g, '')
    .replace(/[^a-z0-9]/g, '')

try {
  const { docs } = await payload.find({ collection: 'produtos', depth: 0, limit: 1000 })
  type P = { id: string | number; codigoSite?: string; nome?: string; imagemAmbientada?: unknown }
  const prods = docs as P[]

  const grupos = new Map<string, P[]>()
  for (const p of prods) {
    const k = baseKey(p.nome ?? '')
    if (!grupos.has(k)) grupos.set(k, [])
    grupos.get(k)!.push(p)
  }

  let done = 0
  const semDoador: string[] = []
  for (const p of prods) {
    if (idOf(p.imagemAmbientada)) continue // ja tem
    const grupo = grupos.get(baseKey(p.nome ?? '')) ?? []
    const doador = grupo.find((x) => idOf(x.imagemAmbientada))
    if (!doador) {
      semDoador.push(String(p.codigoSite))
      continue
    }
    const mid = idOf(doador.imagemAmbientada)
    if (DRY) {
      payload.logger.info(`[DRY] ${p.codigoSite} <- ${doador.codigoSite} (media ${mid})`)
      done++
      continue
    }
    await payload.update({ collection: 'produtos', id: p.id, data: { imagemAmbientada: mid } })
    payload.logger.info(`${p.codigoSite} <- ${doador.codigoSite} (media ${mid})`)
    done++
  }

  payload.logger.info(
    `${DRY ? '[DRY RUN] ' : ''}OK. herdaram: ${done} | sem doador (orfaos): ${semDoador.length}`,
  )
  process.exit(0)
} catch (err) {
  console.error('Falha no inherit de ambientada:', err)
  process.exit(1)
}
