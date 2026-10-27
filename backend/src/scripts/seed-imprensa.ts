// Popula a collection `imprensa` com o clipping real do cliente (doc "GRUPO BB -
// CLIPPINGS", 10 materias 2008-2023). Texto puro (sem imagem), DB-only, nao
// precisa de R2. Idempotente: pula quem ja existe pela url.
//
// Uso (na pasta backend/):
//   DRY:  IMP_DRY=1 PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-imprensa.ts
//   REAL:          PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-imprensa.ts

import { getPayload } from 'payload'
import config from '@payload-config'

const DRY = process.env.IMP_DRY === '1'

type Mat = { titulo: string; veiculo: string; data: string; url: string }
const MATERIAS: Mat[] = [
  { titulo: 'No que é que a baiana inova?', veiculo: 'Blog Sebrae (Clarice Veras)', data: '2008-12-22', url: 'https://clariceveras.wordpress.com/2008/12/22/no-que-e-que-a-baiana-inova/' },
  { titulo: 'Prêmio MPE Brasil: conheça os vencedores do prêmio', veiculo: 'BahiaJá', data: '2010-12-15', url: 'https://bahiaja.com.br/noticia.php?idNoticia=31527' },
  { titulo: 'Prêmio MPE mostra a força das empresas do interior', veiculo: 'Revista Conexão nº 189 (Sebrae/BA)', data: '2011-02-01', url: 'https://bibliotecas.sebrae.com.br/chronus/ARQUIVOS_CHRONUS/bds/bds.nsf/F6A9A82C76CE1AFC8325783B0072EB0F/$File/NT00045396.pdf' },
  { titulo: 'Pequenas empresas mostram que também podem ser sustentáveis', veiculo: 'Correio Nagô', data: '2013-01-01', url: 'https://correionago.com.br/pequenas-empresas-mostram-na-feira-do-empreendedor-que-tambem-podem-ser-sustentaveis/' },
  { titulo: 'Alta do dólar reanima mercado nacional para venda de brindes', veiculo: 'ABRAS (Associação Brasileira de Supermercados)', data: '2015-10-21', url: 'https://abras.com.br/clipping/geral/53308/alta-do-dolar-reanima-mercado-nacional-para-venda-de-brindes' },
  { titulo: 'Empresa de brindes de Lauro de Freitas lança linha de álcool gel durante a pandemia do coronavírus', veiculo: 'g1 Bahia', data: '2020-04-08', url: 'https://g1.globo.com/ba/bahia/noticia/2020/04/08/empresa-de-brindes-de-lauro-de-freitas-lanca-linha-de-alcool-gel-durante-a-pandemia-do-coronavirus.ghtml' },
  { titulo: 'Indústria baiana lança linha própria de álcool gel', veiculo: 'Site Lícia Fabio', data: '2020-04-08', url: 'https://liciafabio.com.br/industria-baiana-lanca-linha-propria-de-alcool-gel/' },
  { titulo: 'Indústria baiana retoma a fabricação de álcool em gel contra COVID-19', veiculo: 'iPolítica', data: '2020-01-01', url: 'https://ipolitica.blog.br/industria-baiana-retoma-a-fabricacao-de-alcool-em-gel-contra-covid-19/' },
  { titulo: 'Indústria ecossustentável e Startup desenvolvem produtos feitos com resíduos de plástico descartados na natureza', veiculo: 'Folha do Norte', data: '2022-12-19', url: 'https://folhadonortejornal.com.br/industria-ecossustentavel-e-startup-desenvolvem-produtos-feitos-com-residuos-de-plastico-descartados-na-natureza/' },
  { titulo: 'Enriquecimento comercial para empresas do plástico', veiculo: 'Plástico Virtual', data: '2023-09-18', url: 'https://plasticovirtual.com.br/enriquecimento-comercial-para-empresas-do-plastico/' },
]

const payload = await getPayload({ config })

try {
  let done = 0
  const pulados: string[] = []
  for (const m of MATERIAS) {
    const existe = await payload.find({
      collection: 'imprensa',
      where: { url: { equals: m.url } },
      depth: 0,
      limit: 1,
    })
    if (existe.docs.length) {
      pulados.push(m.veiculo)
      continue
    }
    if (DRY) {
      payload.logger.info(`[DRY] cria: ${m.data} | ${m.veiculo} | ${m.titulo}`)
      done++
      continue
    }
    await payload.create({ collection: 'imprensa', data: m })
    payload.logger.info(`OK: ${m.veiculo} (${m.data})`)
    done++
  }
  payload.logger.info(`${DRY ? '[DRY RUN] ' : ''}OK. criadas: ${done} | puladas(ja existia): ${pulados.length}`)
  process.exit(0)
} catch (err) {
  console.error('Falha no seed de imprensa:', err)
  process.exit(1)
}
