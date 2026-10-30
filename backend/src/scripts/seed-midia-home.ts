// Seed das imagens dos blocos urgencia/eco do global `conteudo-home` (FB-6 midia).
// Sobe os 3 assets atuais (os mesmos que o front usa hardcoded hoje) pra Media e
// amarra nos grupos urgencia/ecoBanner/ecoLead. Idempotente: reusa o Media por
// filename e so seta o relacionamento. Preserva toda a copy ja existente do global
// (le com depth 0 e faz spread dos grupos, pra nao zerar os outros campos).
//
// Rodar na pasta backend/ (via railway run, pra usar o R2 de prod):
//   railway run npx payload run src/scripts/seed-midia-home.ts

import path from 'path'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'
import config from '@payload-config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const IMG = path.resolve(dirname, '../../../frontend/public/img')

// grupo do global -> caminho do asset atual (igual ao que o front referencia).
const ALVOS: { grupo: 'urgencia' | 'ecoBanner' | 'ecoLead'; arquivo: string; alt: string }[] = [
  { grupo: 'urgencia', arquivo: 'foto/MV02406GC-super-bowl-green-fibras-colors-500ml.webp', alt: 'Super bowl Green Fibras Colors 500ml' },
  { grupo: 'ecoBanner', arquivo: 'banners/home-hero-fixo-2-linha-ecologica.webp', alt: 'Linha ecologica BB Brindes' },
  { grupo: 'ecoLead', arquivo: 'foto/MV02146G-copo-mini-roma-ecologico-green-fibras-300ml.webp', alt: 'Copo Mini Roma ecologico Green Fibras 300ml' },
]

const payload = await getPayload({ config })

async function mediaId(arquivo: string, alt: string): Promise<number> {
  const filename = path.basename(arquivo)
  const existe = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  if (existe.totalDocs > 0) return existe.docs[0].id as number
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(IMG, arquivo),
  })
  return doc.id as number
}

const atual = (await payload.findGlobal({ slug: 'conteudo-home', depth: 0 })) as Record<string, any>

const ids: Record<string, number> = {}
for (const a of ALVOS) ids[a.grupo] = await mediaId(a.arquivo, a.alt)

await payload.updateGlobal({
  slug: 'conteudo-home',
  data: {
    urgencia: { ...(atual.urgencia ?? {}), imagem: ids.urgencia },
    ecoBanner: { ...(atual.ecoBanner ?? {}), imagem: ids.ecoBanner },
    ecoLead: { ...(atual.ecoLead ?? {}), imagem: ids.ecoLead },
  } as any,
})

payload.logger.info(`[seed-midia-home] imagens amarradas: urgencia=${ids.urgencia} ecoBanner=${ids.ecoBanner} ecoLead=${ids.ecoLead}`)
process.exit(0)
