// Migra as campanhas ja publicadas no site para o painel, sem sobrescrever
// cadastros existentes. Executar no backend com railway run (banco e R2).
// Sem CAMPANHAS_APPLY=1: somente leitura e relatorio do que seria criado.
// Os oito produtos iniciais reproduzem a selecao anterior do site; o cliente
// pode ajustar cada relacao no painel depois. Nao representam curadoria nova.
import path from 'path'
import { fileURLToPath } from 'url'
import { existsSync } from 'fs'
import { getPayload } from 'payload'
import config from '@payload-config'
import { campanhas } from '../../../frontend/src/data/campanhas'
import { CAMP_TILE } from '../../../frontend/src/data/home-joy'

const apply = process.env.CAMPANHAS_APPLY === '1'
const banners = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../frontend/public/img/banners')
// O rebuild sera disparado explicitamente depois da migracao completa.
// A alteracao e apenas neste processo, sem mudar as variaveis do Railway.
delete process.env.GITHUB_DEPLOY_TOKEN

function arquivoCampanha(slug: string) {
  const base = CAMP_TILE[slug]
  return base ? `campanha-topo-${base}.webp` : undefined
}

function validarArtes() {
  for (const campanha of campanhas) {
    const arquivo = arquivoCampanha(campanha.slug)
    if (arquivo && !existsSync(path.join(banners, arquivo))) {
      throw new Error(`Arte ausente: ${campanha.slug}`)
    }
  }
}

async function garantirMedia(payload: Awaited<ReturnType<typeof getPayload>>, filename: string, nome: string) {
  const media = await payload.find({ collection: 'media',
    where: { filename: { equals: filename } }, limit: 1, depth: 0 })
  if (media.docs[0]) return media.docs[0].id
  const upload = await payload.create({ collection: 'media',
    data: { alt: `Brindes personalizados para ${nome}` },
    filePath: path.join(banners, filename) })
  return upload.id
}

async function run() {
  const payload = await getPayload({ config })
  const produtos = await payload.find({ collection: 'produtos', depth: 0, limit: 1000 })
  const peso = (produto: typeof produtos.docs[number]) =>
    (produto.ecologico ? 2 : 0) + ((produto.destaques ?? []).includes('lancamento') ? 1 : 0)
  const selecionados = [...produtos.docs].sort((a, b) => peso(b) - peso(a)).slice(0, 8)
  if (selecionados.length === 0) throw new Error('Catalogo vazio; migracao cancelada.')

  validarArtes()
  console.log(JSON.stringify({ modo: apply ? 'APLICAR' : 'SIMULAR', campanhas: campanhas.length,
    produtosIniciais: selecionados.map((produto) => produto.slug) }))

  let criadas = 0
  let preservadas = 0
  for (const campanha of campanhas) {
    const existente = await payload.find({ collection: 'campanhas',
      where: { slug: { equals: campanha.slug } }, limit: 1, depth: 0 })
    if (existente.totalDocs > 0) {
      preservadas++
      console.log(`PRESERVAR ${campanha.slug}`)
      continue
    }
    const filename = arquivoCampanha(campanha.slug)
    if (apply) {
      const imagem = filename ? await garantirMedia(payload, filename, campanha.nome) : undefined
      await payload.create({ collection: 'campanhas', data: {
        nome: campanha.nome, slug: campanha.slug, mes: campanha.mes,
        chamada: 'Brindes selecionados para a data, com a sua marca aplicada. Monte seu orçamento.',
        imagem, produtos: selecionados.map((produto) => produto.id), ativo: true,
      } })
    }
    criadas++
    console.log(`${apply ? 'CRIADA' : 'CRIAR'} ${campanha.slug} | ${campanha.mes} | arte=${filename ?? 'sem arte'} | produtos=${selecionados.length}`)
  }
  console.log(JSON.stringify({ modo: apply ? 'APLICADO' : 'SIMULADO', criadas, preservadas }))
}

try { await run(); process.exit(0) }
catch (error) { console.error(error); process.exit(1) }
