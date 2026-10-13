// One-off: apaga as midias do Squeeze (match por alt) para forcar o re-upload
// quando a config de storage muda (disco local -> S3/Supabase Storage). Depois
// deste reset, rodar o seed produto-squeeze.ts recria as midias subindo os
// arquivos reais para o bucket. Idempotente: se nao achar nada, nao faz nada.
//
//   (com o ambiente do Railway injetado, na pasta backend/)
//   railway run --service heartfelt-courtesy -- node_modules/.bin/payload run src/seed/reset-squeeze-media.ts

import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })

  const found = await payload.find({
    collection: 'media',
    where: { alt: { like: 'Squeeze 300 mL personalizado da BB Brindes' } },
    limit: 100,
  })
  payload.logger.info(`Midias do Squeeze encontradas: ${found.docs.length}`)

  for (const doc of found.docs) {
    await payload.delete({ collection: 'media', id: doc.id })
    payload.logger.info(`apagada media id=${doc.id} filename=${doc.filename ?? ''}`)
  }

  payload.logger.info('Reset de midia do Squeeze concluido')
}

try {
  await run()
  process.exit(0)
} catch (err) {
  console.error('Falha no reset de midia do Squeeze:', err)
  process.exit(1)
}
