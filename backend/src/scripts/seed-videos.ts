// Popula `produtos.videoUrl` com o video (YouTube) da LINHA do produto. Os 6
// videos (doc ok_VIDEOS DE PRODUTOS) sao por categoria, nao por SKU. Mapeia por
// slug, com precedencia; produtos fora das linhas de bebida eco caem no video da
// "Linha Green"; os demais ficam sem video. DB-only (campo texto).
//
// Uso (na pasta backend/):
//   DRY:  VID_DRY=1 PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-videos.ts
//   REAL:          PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-videos.ts
// Flags: VID_OVERWRITE=1 (troca quem ja tem)

import { getPayload } from 'payload'
import config from '@payload-config'

const DRY = process.env.VID_DRY === '1'
const OVERWRITE = process.env.VID_OVERWRITE === '1'

const V = {
  TAMPA_CANUDO: 'https://www.youtube.com/watch?v=jnU3v2Ni1so',
  CANECAS: 'https://www.youtube.com/watch?v=2t6VK1C_tCw',
  COPOS: 'https://www.youtube.com/watch?v=VdlctuY-6fs',
  MUG: 'https://www.youtube.com/watch?v=T6ubs3U7MfQ',
  SQUEEZE: 'https://www.youtube.com/watch?v=8rIi8VowQ7A',
  LINHA_GREEN: 'https://www.youtube.com/watch?v=r9g6dCNEXWo',
}

const videoFor = (slug: string, eco: boolean): string | null => {
  const s = slug.toLowerCase()
  if (/mug/.test(s)) return V.MUG
  if (/squeeze/.test(s)) return V.SQUEEZE
  if (/canudo/.test(s)) return V.TAMPA_CANUDO
  if (/caneca/.test(s)) return V.CANECAS
  if (/copo|cantil/.test(s)) return V.COPOS
  // Decisao Fabio 27/10: video SO nas linhas de bebida. A "Linha Green" (visao
  // geral) NAO entra como catch-all de todo eco; vai noutro lugar (pagina de
  // linha), nao no card de cada produto. `eco` fica sem uso aqui de proposito.
  void eco
  return null
}

const nomeVideo = (url: string) =>
  (Object.entries(V).find(([, u]) => u === url) || ['?'])[0]

const payload = await getPayload({ config })

try {
  const { docs } = await payload.find({ collection: 'produtos', depth: 0, limit: 1000 })
  let done = 0
  const semVideo: string[] = []
  const dist: Record<string, number> = {}
  for (const p of docs as Array<{
    id: string | number
    codigoSite?: string
    slug?: string
    ecologico?: boolean
    videoUrl?: string
  }>) {
    if (p.videoUrl && !OVERWRITE) continue
    const url = videoFor(p.slug ?? '', !!p.ecologico)
    if (!url) {
      semVideo.push(String(p.codigoSite))
      continue
    }
    dist[nomeVideo(url)] = (dist[nomeVideo(url)] || 0) + 1
    if (DRY) {
      done++
      continue
    }
    await payload.update({ collection: 'produtos', id: p.id, data: { videoUrl: url } })
    done++
  }
  payload.logger.info(`${DRY ? '[DRY RUN] ' : ''}OK. com video: ${done} | sem video: ${semVideo.length}`)
  payload.logger.info('distribuicao: ' + JSON.stringify(dist))
  payload.logger.info('sem video (cods): ' + semVideo.join(', '))
  process.exit(0)
} catch (err) {
  console.error('Falha no seed de videos:', err)
  process.exit(1)
}
