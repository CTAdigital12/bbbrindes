// Seed de um post de TESTE para validar o front lendo o Payload (S03-04).
// Idempotente: se ja existir um post com o mesmo slug, apaga e recria. Roda com
// o Local API (sem precisar de login), via:
//   node_modules/.bin/payload run src/seed/post-teste.ts
// O `payload run` ja carrega o .env (DATABASE_URI, PAYLOAD_SECRET).
//
// O titulo/resumo/conteudo tem a palavra "teste" de proposito, para ficar obvio
// que e o artigo de teste e nao conteudo real do cliente.

import { getPayload } from 'payload'
import config from '@payload-config'

// Monta um paragrafo no formato lexical (richText) que o Payload espera.
const paragrafo = (texto: string) => ({
  type: 'paragraph',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr' as const,
  children: [
    {
      type: 'text',
      version: 1,
      text: texto,
      format: 0,
      style: '',
      mode: 'normal' as const,
      detail: 0,
    },
  ],
})

const SLUG = 'artigo-teste-seed'

const run = async () => {
  const payload = await getPayload({ config })

  const existentes = await payload.find({
    collection: 'posts',
    where: { slug: { equals: SLUG } },
    limit: 1,
  })
  for (const doc of existentes.docs) {
    await payload.delete({ collection: 'posts', id: doc.id })
  }

  const post = await payload.create({
    collection: 'posts',
    data: {
      titulo: 'Artigo de TESTE (seed) para validar o Payload',
      slug: SLUG,
      resumo:
        'Este e um post de TESTE criado por seed. Se voce esta vendo este resumo com a palavra teste, o front esta lendo do Payload, nao do mock.',
      data: new Date('2026-08-27').toISOString(),
      autor: 'Seed de teste',
      conteudo: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: [
            paragrafo(
              'Primeiro paragrafo do artigo de TESTE. Este texto vem do banco (Payload), inserido via seed. A palavra teste aparece de proposito para diferenciar do conteudo real.',
            ),
            paragrafo(
              'Segundo paragrafo de TESTE. Quando o cliente cadastrar posts de verdade no painel, eles substituem este placeholder de teste automaticamente.',
            ),
          ],
        },
      },
    },
  })

  payload.logger.info(`Post de teste criado: id=${post.id} slug=${SLUG}`)
}

// Top-level await: mantem o processo vivo ate o create terminar. Sem isso, o
// `payload run` resolve o import antes do trabalho async e o processo encerra
// cortando a escrita no banco.
try {
  await run()
  process.exit(0)
} catch (err) {
  console.error('Falha no seed do post de teste:', err)
  process.exit(1)
}
