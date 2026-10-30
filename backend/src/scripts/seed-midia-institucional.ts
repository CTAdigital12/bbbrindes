// Seed das fotos do Quem somos do global `conteudo-institucional` (FB-6 midia).
// Sobe os assets atuais (os mesmos que o front usa hardcoded hoje, em
// frontend/public/img/institucional) pra Media e amarra no grupo quemSomos:
// fotoFabrica (inst-01) + galeria (6 fotos com legenda). Idempotente: reusa o
// Media por filename. Preserva toda a copy ja existente do global (le com depth 0
// e faz spread do grupo).
//
// Rodar na pasta backend/ (via railway run, pra usar o R2 de prod):
//   railway run npx payload run src/scripts/seed-midia-institucional.ts

import path from 'path'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'
import config from '@payload-config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const INST = path.resolve(dirname, '../../../frontend/public/img/institucional')

const FOTO_FABRICA = { arquivo: 'inst-01.webp', alt: 'Fábrica própria da BB Brindes' }

// Mesma ordem/legendas do front (quem-somos/page.tsx GALERIA).
const GALERIA: { arquivo: string; legenda: string }[] = [
  { arquivo: 'inst-05.webp', legenda: 'Máquina de injeção e sopro na fábrica' },
  { arquivo: 'inst-04.webp', legenda: 'Produção de squeezes da linha ecológica' },
  { arquivo: 'inst-02.webp', legenda: 'Lote de squeezes personalizados' },
  { arquivo: 'inst-03.webp', legenda: 'Produtos em In Mold Label' },
  { arquivo: 'inst-06.webp', legenda: 'Estande da BB Brindes em feira do setor' },
  { arquivo: 'inst-07.webp', legenda: 'BB Brindes em feira do setor' },
]

const payload = await getPayload({ config })

async function mediaId(arquivo: string, alt: string): Promise<number> {
  const existe = await payload.find({
    collection: 'media',
    where: { filename: { equals: arquivo } },
    limit: 1,
  })
  if (existe.totalDocs > 0) return existe.docs[0].id as number
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(INST, arquivo),
  })
  return doc.id as number
}

const atual = (await payload.findGlobal({ slug: 'conteudo-institucional', depth: 0 })) as Record<string, any>

const fotoFabricaId = await mediaId(FOTO_FABRICA.arquivo, FOTO_FABRICA.alt)
const galeria: { imagem: number; legenda: string }[] = []
for (const g of GALERIA) galeria.push({ imagem: await mediaId(g.arquivo, g.legenda), legenda: g.legenda })

await payload.updateGlobal({
  slug: 'conteudo-institucional',
  data: {
    quemSomos: { ...(atual.quemSomos ?? {}), fotoFabrica: fotoFabricaId, galeria },
  } as any,
})

payload.logger.info(`[seed-midia-institucional] fotoFabrica=${fotoFabricaId} galeria=${galeria.length} fotos`)
process.exit(0)
