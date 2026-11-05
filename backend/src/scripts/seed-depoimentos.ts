// Seed dos depoimentos (FB-6 conectividade). Upsert por autor, idempotente.
// Popula a collection com os 2 depoimentos que estavam fixos no front (QUOTES em
// home-joy.ts). Roda na pasta backend/:
//   PAYLOAD_DB_PUSH=false npx payload run src/scripts/seed-depoimentos.ts
// (ou via railway run em prod, depois que a tabela existir).

import { getPayload } from 'payload'
import config from '@payload-config'

const DEPOIMENTOS = [
  {
    texto: 'Vocês foram brilhantes. Os brindes ficaram lindos. Cumpriram os prazos com excelência.',
    autor: 'Lilian Bueno',
    empresa: 'Braskem',
  },
  {
    texto:
      'O produto que recebi é de excelente qualidade e o pedido foi entregue corretamente, antes mesmo do combinado.',
    autor: 'Wilson Dias Lima',
    empresa: 'TOP Fitness',
  },
]

const run = async () => {
  const payload = await getPayload({ config })
  let criados = 0
  let atualizados = 0
  for (let i = 0; i < DEPOIMENTOS.length; i++) {
    const d = DEPOIMENTOS[i]
    const data = { ...d, ordem: i, ativo: true }
    const existente = await payload.find({
      collection: 'depoimentos',
      where: { autor: { equals: d.autor } },
      limit: 1,
    })
    if (existente.docs.length > 0) {
      await payload.update({ collection: 'depoimentos', id: existente.docs[0].id, data })
      atualizados++
    } else {
      await payload.create({ collection: 'depoimentos', data })
      criados++
    }
  }
  payload.logger.info(`Depoimentos: ${criados} criados, ${atualizados} atualizados.`)
}

try {
  await run()
  process.exit(0)
} catch (err) {
  console.error('Falha no seed de depoimentos:', err)
  process.exit(1)
}
