// Seed dos 15 logos atuais (frontend/public/img/logos/*.svg) na collection `logos`,
// na mesma ordem do marquee do site (home-joy.ts LOGOS). Idempotente: pula o que ja
// existe (por nome). Em prod sobe os arquivos pro R2.
//
// Rodar na pasta backend/ (via railway run, pra usar o R2 de prod):
//   railway run npx payload run src/scripts/seed-logos.ts

import path from 'path'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'
import config from '@payload-config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const LOGOS_DIR = path.resolve(dirname, '../../../frontend/public/img/logos')

const LOGOS = [
  'coca-cola', 'nestle', 'banco-do-brasil', 'ambev', 'heineken', 'bradesco',
  'braskem', 'google', 'fedex', 'scania', 'positivo', 'levis', 'oral-b',
  'anglo-american', 'devassa',
]

const payload = await getPayload({ config })
let criados = 0
for (let i = 0; i < LOGOS.length; i++) {
  const slug = LOGOS[i]
  const existe = await payload.find({
    collection: 'logos',
    where: { nome: { equals: slug } },
    limit: 1,
  })
  if (existe.totalDocs > 0) continue
  await payload.create({
    collection: 'logos',
    data: { nome: slug, ordem: i + 1 },
    filePath: path.join(LOGOS_DIR, `${slug}.svg`),
  })
  criados++
}
payload.logger.info(`[seed-logos] ${criados} logos criados (de ${LOGOS.length}).`)
process.exit(0)
