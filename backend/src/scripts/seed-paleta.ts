// Popula a collection `cores-bb` (paleta de cores) a partir da constante CORES_BB de
// components/produto/cores-bb.ts (secao 2.4 da spec feature-cores-base-acessorio).
//
// Upsert IDEMPOTENTE por `codigo`: pode rodar quantas vezes quiser. Produto final = a
// paleta mestra hardcoded refletida na collection, pronta para o cliente editar.
//
// NAO roda contra o banco de prod automaticamente: quem roda e o Fabio. Rode na pasta
// backend/:
//   DRY:  PALETA_DRY=1 PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-paleta.ts
//   REAL:            PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-paleta.ts

import config from '@payload-config'
import { getPayload } from 'payload'

import { CORES_BB } from '../components/produto/cores-bb'

const DRY = process.env.PALETA_DRY === '1'

const payload = await getPayload({ config })

try {
  let criadas = 0
  let atualizadas = 0

  for (const cor of CORES_BB) {
    const data = {
      codigo: cor.codigo,
      nome: cor.nome,
      hex: cor.hex || undefined,
      grupo: cor.grupo,
    }

    const { docs } = await payload.find({
      collection: 'cores-bb',
      where: { codigo: { equals: cor.codigo } },
      limit: 1,
      depth: 0,
    })

    if (docs.length > 0) {
      if (!DRY) {
        await payload.update({ collection: 'cores-bb', id: docs[0].id, data })
      }
      atualizadas++
    } else {
      if (!DRY) {
        await payload.create({ collection: 'cores-bb', data })
      }
      criadas++
    }
  }

  payload.logger.info(
    `${DRY ? '[DRY RUN] ' : ''}paleta cores-bb: ${CORES_BB.length} cores | criar: ${criadas} | atualizar: ${atualizadas}`,
  )
  process.exit(0)
} catch (err) {
  console.error('Falha no seed da paleta:', err)
  process.exit(1)
}
