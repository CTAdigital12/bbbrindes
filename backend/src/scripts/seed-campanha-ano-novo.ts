// Completa apenas a imagem ausente de Ano Novo. Preserva os demais campos.
// Executar com railway run npx payload run src/scripts/seed-campanha-ano-novo.ts.
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'

delete process.env.GITHUB_DEPLOY_TOKEN
const filename = 'campanha-topo-ano-novo.webp'
const filePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../frontend/public/img/banners', filename)

async function run() {
  const payload = await getPayload({ config })
  const result = await payload.find({ collection: 'campanhas',
    where: { slug: { equals: 'ano-novo' } }, limit: 1, depth: 0 })
  const campanha = result.docs[0]
  if (!campanha) throw new Error('Campanha Ano Novo ausente; cancelar.')
  if (campanha.imagem) {
    console.log('Ano Novo ja possui imagem; cadastro preservado.')
    return
  }
  const media = await payload.find({ collection: 'media',
    where: { filename: { equals: filename } }, limit: 1, depth: 0 })
  const imagem = media.docs[0] ?? await payload.create({ collection: 'media',
    data: { alt: 'Canecas reutilizaveis em composicao verde e dourada para Ano Novo Corporativo' }, filePath })
  await payload.update({ collection: 'campanhas', id: campanha.id, data: { imagem: imagem.id } })
  console.log(JSON.stringify({ campanha: campanha.slug, id: campanha.id, imagem: imagem.id, filename }))
}
try { await run(); process.exit(0) }
catch (error) { console.error(error); process.exit(1) }
