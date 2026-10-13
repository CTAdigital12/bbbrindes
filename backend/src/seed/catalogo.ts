// Seed do catalogo (S03-05): importa os produtos da planilha do cliente para a
// collection `produtos`. Upsert por codigoSite, idempotente. DATA-ONLY: cadastra
// texto, specs, categorias, selos, SEO, logistica, impressao e canais. NAO mexe
// em imagens, imagem ambientada nem cores (o Plinio ainda vai mandar as fotos e a
// fonte de cor/tom), entao o Squeeze piloto (109) mantem as 15 fotos que ja subimos.
//
// Fonte: backend/src/seed/data/catalogo.json, gerado por
// docs/importacao-catalogo/build-catalogo-json.py a partir do CSV bruto (o CSV e o
// JSON ficam fora do repo, ver .gitignore). As categorias precisam existir antes
// (rode seed:squeeze, que semeia as 15).
//
//   npm run seed:catalogo            (na pasta backend/)
//   CATALOGO_DRY=1 npm run seed:catalogo   (valida o mapeamento sem gravar)

import path from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import config from '@payload-config'

type ProdutoData = RequiredDataFromCollectionSlug<'produtos'>

const dirname = path.dirname(fileURLToPath(import.meta.url))

// As 13 chaves de selo, na ordem do schema (grupo `selos` em Produtos.ts).
const SELO_KEYS = [
  'livreDeBpa', 'usoMicroondas', 'usoLavaLoucas', 'recicladoTotal',
  'logisticaReversa', 'usoPermanente', 'reducaoCo2', 'fonteRenovavel',
  'designCircular', 'upcycling', 'fibraNatural', 'reciclavel', 'reducaoPlastico',
] as const

type ProdutoJson = {
  codigoSite: string
  codigoCigam: string | null
  nome: string
  slug: string
  subtitulo: string | null
  descricaoCurta: string | null
  descricaoCompletaParagrafos: string[]
  beneficios: string[]
  idealPara: string[]
  diferenciais: string[]
  especificacoes: { rotulo: string; valor: string }[]
  categorias: string[]
  ecologico: boolean
  selos: Record<string, boolean>
  seo: {
    titleTag: string | null
    metaDescription: string | null
    palavrasChave: string[]
    altTextPrincipal: string | null
  }
  logistica: Record<string, string | number | null>
  impressao: Record<string, string | null>
  canais: { site: boolean; tabelaRevenda: boolean; tabelaB2B: boolean }
}

// Paragrafo lexical (richText) que o Payload espera.
const paragrafo = (texto: string) => ({
  type: 'paragraph',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr' as const,
  children: [
    { type: 'text', version: 1, text: texto, format: 0, style: '', mode: 'normal' as const, detail: 0 },
  ],
})

const montarRichText = (paragrafos: string[]) =>
  paragrafos.length === 0
    ? undefined
    : {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: paragrafos.map(paragrafo),
        },
      }

// Grupo com os nulos/vazios removidos (o Payload guarda o campo como veio).
const semVazios = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined && v !== '') out[k] = v
  }
  return out as Partial<T>
}

const montarSelos = (selos: Record<string, boolean>) =>
  Object.fromEntries(SELO_KEYS.map((k) => [k, selos[k] === true]))

const run = async () => {
  const payload = await getPayload({ config })
  const dry = process.env.CATALOGO_DRY === '1'

  const jsonPath = path.resolve(dirname, 'data', 'catalogo.json')
  const produtos = JSON.parse(readFileSync(jsonPath, 'utf8')) as ProdutoJson[]
  payload.logger.info(`Catalogo carregado: ${produtos.length} produtos${dry ? ' (DRY RUN)' : ''}`)

  // slug de categoria -> id (as categorias precisam ja existir).
  const cats = await payload.find({ collection: 'categorias', limit: 200, depth: 0 })
  const catId: Record<string, number> = {}
  for (const c of cats.docs) catId[(c as { slug: string }).slug] = (c as { id: number }).id

  const slugsFaltando = new Set<string>()
  for (const p of produtos) {
    for (const s of p.categorias) if (!(s in catId)) slugsFaltando.add(s)
  }
  if (slugsFaltando.size > 0) {
    throw new Error(
      `Categorias inexistentes no banco: ${[...slugsFaltando].join(', ')}. Rode seed:squeeze primeiro (ele semeia as 15 categorias).`,
    )
  }

  let criados = 0
  let atualizados = 0

  for (const p of produtos) {
    // Campos que a planilha e fonte da verdade. NAO inclui imagens/cores: em
    // update o Payload preserva o que nao vier no data (mantem as fotos do Squeeze).
    const data: Record<string, unknown> = {
      codigoSite: p.codigoSite,
      codigoCigam: p.codigoCigam ?? undefined,
      nome: p.nome,
      slug: p.slug,
      subtitulo: p.subtitulo ?? undefined,
      descricaoCurta: p.descricaoCurta ?? undefined,
      descricaoCompleta: montarRichText(p.descricaoCompletaParagrafos),
      beneficios: p.beneficios,
      idealPara: p.idealPara,
      diferenciais: p.diferenciais,
      especificacoes: p.especificacoes,
      categorias: p.categorias.map((s) => catId[s]),
      ecologico: p.ecologico,
      selos: montarSelos(p.selos),
      seo: {
        titleTag: p.seo.titleTag ?? undefined,
        metaDescription: p.seo.metaDescription ?? undefined,
        palavrasChave: p.seo.palavrasChave,
        altTextPrincipal: p.seo.altTextPrincipal ?? undefined,
      },
      logistica: semVazios(p.logistica),
      impressao: semVazios(p.impressao),
      canais: p.canais,
    }

    const existente = await payload.find({
      collection: 'produtos',
      where: { codigoSite: { equals: p.codigoSite } },
      limit: 1,
      depth: 0,
    })

    if (dry) {
      if (existente.docs.length > 0) atualizados++
      else criados++
      continue
    }

    if (existente.docs.length > 0) {
      await payload.update({ collection: 'produtos', id: existente.docs[0].id, data: data as ProdutoData })
      atualizados++
    } else {
      await payload.create({ collection: 'produtos', data: data as ProdutoData })
      criados++
    }

    const total = criados + atualizados
    if (total % 25 === 0) payload.logger.info(`... ${total}/${produtos.length}`)
  }

  payload.logger.info(
    `Catalogo ${dry ? '(DRY) ' : ''}concluido: ${criados} criados, ${atualizados} atualizados (imagens/cores preservadas).`,
  )
}

try {
  await run()
  process.exit(0)
} catch (err) {
  console.error('Falha no seed do catalogo:', err)
  process.exit(1)
}
