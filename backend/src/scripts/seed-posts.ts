// Popula a collection `posts` (blog) com os 3 artigos do cliente (doc ok_BLOG).
// Le um plano JSON [{titulo, autor, data, resumo, paragrafos[]}] e monta o
// conteudo richText (Lexical) a partir dos paragrafos. DB-only, idempotente por
// titulo. slug auto-gera do titulo.
//
// Uso (na pasta backend/):
//   BLOG_PLAN="<abs>" DRY=1 PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-posts.ts
//   BLOG_PLAN="<abs>"       PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-posts.ts

import { getPayload } from 'payload'
import config from '@payload-config'
import { readFileSync } from 'fs'

const DRY = process.env.POST_DRY === '1'
const planPath = process.env.BLOG_PLAN
if (!planPath) {
  console.error('Faltou BLOG_PLAN (json).')
  process.exit(1)
}

type Art = { titulo: string; autor?: string; data: string; resumo?: string; paragrafos: string[] }
const plan: Art[] = JSON.parse(readFileSync(planPath, 'utf-8'))

// Lexical (formato do @payloadcms/richtext-lexical): root com paragrafos.
const lexical = (paras: string[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paras.map((t) => ({
      type: 'paragraph',
      version: 1,
      format: '',
      indent: 0,
      direction: 'ltr' as const,
      textFormat: 0,
      textStyle: '',
      children: [
        { type: 'text', version: 1, text: t, format: 0, style: '', mode: 'normal', detail: 0 },
      ],
    })),
  },
})

const payload = await getPayload({ config })

try {
  let done = 0
  const pulados: string[] = []
  for (const a of plan) {
    const existe = await payload.find({
      collection: 'posts',
      where: { titulo: { equals: a.titulo } },
      depth: 0,
      limit: 1,
    })
    if (existe.docs.length) {
      pulados.push(a.titulo)
      continue
    }
    const data = {
      titulo: a.titulo,
      autor: a.autor ?? 'Equipe BB Brindes',
      data: a.data,
      resumo: a.resumo ?? '',
      conteudo: lexical(a.paragrafos),
    }
    if (DRY) {
      payload.logger.info(`[DRY] cria: ${a.titulo} (${a.paragrafos.length} paragrafos)`)
      done++
      continue
    }
    await payload.create({ collection: 'posts', data })
    payload.logger.info(`OK: ${a.titulo}`)
    done++
  }
  payload.logger.info(`${DRY ? '[DRY RUN] ' : ''}OK. criados: ${done} | pulados: ${pulados.length}`)
  process.exit(0)
} catch (err) {
  console.error('Falha no seed de posts:', err)
  process.exit(1)
}
