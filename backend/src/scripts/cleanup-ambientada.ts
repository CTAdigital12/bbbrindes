// Limpeza do piloto de imagemAmbientada quando o upload foi pro DISCO LOCAL (sem
// railway run) e a media ficou 404 no backend live. Para cada codigoSite em
// AMB_CODS: le o imagemAmbientada atual, zera o campo e apaga a media orfa.
// DB-only (+ delete do arquivo local), NAO precisa de railway/S3.
//
// Uso (na pasta backend/):
//   AMB_CODS=113,306,307 PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/cleanup-ambientada.ts

import { getPayload } from 'payload'
import config from '@payload-config'

const cods = (process.env.AMB_CODS || '').split(',').map((s) => s.trim()).filter(Boolean)
if (!cods.length) {
  console.error('Faltou AMB_CODS (ex: 113,306,307).')
  process.exit(1)
}

const payload = await getPayload({ config })
const idOf = (v: unknown): string | number | null =>
  !v ? null : typeof v === 'object' ? (v as { id: string | number }).id : (v as string | number)

try {
  for (const cod of cods) {
    const { docs } = await payload.find({
      collection: 'produtos',
      where: { codigoSite: { equals: cod } },
      depth: 0,
      limit: 1,
    })
    if (!docs.length) {
      payload.logger.warn(`${cod}: produto nao encontrado`)
      continue
    }
    const prod = docs[0] as { id: string; imagemAmbientada?: unknown }
    const mid = idOf(prod.imagemAmbientada)
    await payload.update({ collection: 'produtos', id: prod.id, data: { imagemAmbientada: null } })
    if (mid != null) {
      try {
        await payload.delete({ collection: 'media', id: mid })
        payload.logger.info(`${cod}: campo zerado + media ${mid} apagada`)
      } catch (e) {
        payload.logger.warn(`${cod}: campo zerado, mas falhou apagar media ${mid}: ${(e as Error).message}`)
      }
    } else {
      payload.logger.info(`${cod}: ja estava sem ambientada`)
    }
  }
  payload.logger.info('cleanup OK')
  process.exit(0)
} catch (err) {
  console.error('Falha no cleanup-ambientada:', err)
  process.exit(1)
}
