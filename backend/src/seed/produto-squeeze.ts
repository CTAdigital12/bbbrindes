// Seed do piloto de produto (S03-02): cadastra o Squeeze 300ml com conteudo
// real da planilha do Plinio e imagens reais, para validar o schema e a PDP
// contra dado de verdade. Idempotente: pode rodar de novo sem duplicar.
//
//   npm run seed:squeeze     (na pasta backend/)
//
// Semeia tambem as 15 categorias validadas (upsert por slug), porque o produto
// se relaciona a elas e o front/home passam a ler categorias reais.

import path from 'path'
import { readdirSync } from 'fs'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'
import config from '@payload-config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

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

// 15 categorias validadas (slug estavel, igual ao front). Grupo "ecologicos"
// so agrupa a familia Green/Medalhas no topo da navegacao; nao e o mesmo que o
// booleano `ecologico` do produto.
const CATEGORIAS: { slug: string; nome: string; grupo: 'ecologicos' | 'geral' }[] = [
  { slug: 'green-plasticaria', nome: 'Ecologicos - Green Plasticaria', grupo: 'ecologicos' },
  { slug: 'green-fibras', nome: 'Ecologicos - Green Fibras', grupo: 'ecologicos' },
  { slug: 'medalhas-trofeus', nome: 'Ecologicos - Medalhas e Trofeus', grupo: 'ecologicos' },
  { slug: 'copos', nome: 'Copos', grupo: 'geral' },
  { slug: 'canecas-xicaras', nome: 'Canecas e Xicaras', grupo: 'geral' },
  { slug: 'chaveiros', nome: 'Chaveiros', grupo: 'geral' },
  { slug: 'casa-decoracao', nome: 'Casa e Decoracao', grupo: 'geral' },
  { slug: 'escritorio', nome: 'Escritorio', grupo: 'geral' },
  { slug: 'squeezes', nome: 'Squeezes', grupo: 'geral' },
  { slug: 'bowls-potes', nome: 'Bowls, Baldes e Potes', grupo: 'geral' },
  { slug: 'to-go-viagem', nome: 'To Go / Viagem', grupo: 'geral' },
  { slug: 'infantil', nome: 'Infantil', grupo: 'geral' },
  { slug: 'cordoes-costurados', nome: 'Cordoes e Costurados', grupo: 'geral' },
  { slug: 'in-mold-label', nome: 'In Mold Label', grupo: 'geral' },
  { slug: 'projetos-especiais', nome: 'Projetos Especiais', grupo: 'geral' },
]

const run = async () => {
  const payload = await getPayload({ config })

  // 1. Categorias (upsert por slug).
  const catId: Record<string, number> = {}
  for (let i = 0; i < CATEGORIAS.length; i++) {
    const c = CATEGORIAS[i]
    const existing = await payload.find({
      collection: 'categorias',
      where: { slug: { equals: c.slug } },
      limit: 1,
    })
    const data = { nome: c.nome, slug: c.slug, grupo: c.grupo, ordem: i }
    if (existing.docs.length > 0) {
      const doc = await payload.update({ collection: 'categorias', id: existing.docs[0].id, data })
      catId[c.slug] = doc.id as number
    } else {
      const doc = await payload.create({ collection: 'categorias', data })
      catId[c.slug] = doc.id as number
    }
  }
  payload.logger.info(`Categorias semeadas: ${Object.keys(catId).length}`)

  // 2. Imagens (upsert por alt; sobe todos os arquivos reais da pasta assets e
  // o Payload gera webp). A primeira (ordem alfabetica) e a principal.
  const assetsDir = path.resolve(dirname, 'assets')
  const arquivos = readdirSync(assetsDir)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .sort()
  const imagemIds: number[] = []
  for (const file of arquivos) {
    const alt = `Squeeze 300 mL personalizado da BB Brindes (${file})`
    const found = await payload.find({
      collection: 'media',
      where: { alt: { equals: alt } },
      limit: 1,
    })
    if (found.docs.length > 0) {
      imagemIds.push(found.docs[0].id as number)
      continue
    }
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      filePath: path.join(assetsDir, file),
    })
    imagemIds.push(doc.id as number)
  }
  payload.logger.info(`Imagens do Squeeze enviadas: ${imagemIds.length}`)

  // 3. Produto Squeeze 300ml (upsert por codigoSite).
  const CODIGO = '109'
  const antigos = await payload.find({
    collection: 'produtos',
    where: { codigoSite: { equals: CODIGO } },
    limit: 10,
  })
  for (const doc of antigos.docs) {
    await payload.delete({ collection: 'produtos', id: doc.id })
  }

  const produto = await payload.create({
    collection: 'produtos',
    data: {
      codigoSite: CODIGO,
      codigoCigam: 'MV01109',
      nome: 'Squeeze 300ml Personalizado',
      slug: 'squeeze-300ml-personalizado',
      subtitulo:
        'Squeeze de 300 mL em polietileno atoxico e livre de BPA, com personalizacao da sua logomarca. Pedidos a partir de 500 unidades.',
      headline: 'Squeeze 300 mL atoxico e livre de BPA, pronto para a sua marca',
      descricaoCurta:
        'O Squeeze 300 mL e um brinde promocional pratico, leve e funcional, ideal para empresas que querem incentivar habitos saudaveis enquanto fortalecem a presenca da marca no dia a dia de clientes e colaboradores.',
      descricaoCompleta: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          children: [
            paragrafo(
              'Pequenos gestos geram grandes conexoes. O Squeeze 300 mL foi desenvolvido para transformar um habito simples, como manter-se hidratado, em uma oportunidade permanente de aproximacao entre a sua marca e o publico.',
            ),
            paragrafo(
              'Produzido em polietileno atoxico e livre de BPA, e reutilizavel, resistente e tem uma otima area para personalizacao da logomarca. Ideal para campanhas de qualidade de vida, SIPAT, eventos e endomarketing.',
            ),
          ],
        },
      },
      beneficios: [
        'Polietileno atoxico e livre de BPA',
        'Reutilizavel, com longa vida util',
        'Incentiva habitos saudaveis e hidratacao',
        'Design leve, compacto e ergonomico',
        'Excelente area para personalizacao',
        'Alta resistencia',
      ],
      idealPara: [
        'Campanhas de qualidade de vida',
        'SIPAT e programas de saude',
        'Academias e eventos esportivos',
        'Onboarding de colaboradores',
        'Endomarketing',
        'Convencoes e treinamentos',
        'Eventos corporativos',
      ],
      diferenciais: [
        'Fabricacao propria',
        'Industria nacional',
        'Personalizacao de alta qualidade',
        'Producao para pequenos e grandes volumes',
        'Mais de 25 anos de experiencia em brindes promocionais',
      ],
      especificacoes: [
        { rotulo: 'Material', valor: 'Polietileno (PEAD + PEBD), atoxico e livre de BPA' },
        { rotulo: 'Capacidade', valor: '300 mL' },
        { rotulo: 'Dimensoes', valor: '7 (L) x 7 (C) x 13,5 (A) cm' },
        { rotulo: 'Peso unitario', valor: '33 g' },
        { rotulo: 'Impressao', valor: 'Heat transfer e serigrafia cilindrica' },
      ],
      seo: {
        titleTag: 'Squeeze 300 mL Personalizado | Brinde Corporativo | BB Brindes',
        metaDescription:
          'Squeeze 300 mL personalizado em polietileno atoxico e livre de BPA. Brinde corporativo para SIPAT, eventos e campanhas de qualidade de vida.',
        palavrasChave: [
          'squeeze personalizado',
          'squeeze 300 ml',
          'squeeze promocional',
          'squeeze para empresas',
          'squeeze corporativo',
          'garrafa personalizada',
          'brindes personalizados',
          'brindes corporativos',
        ],
        altTextPrincipal:
          'Squeeze 300 mL personalizado com logomarca, em polietileno atoxico, da BB Brindes',
      },
      argumentoComercial:
        'Produto de giro alto e baixo custo unitario, com area de gravacao ampla e apelo de saude/bem-estar. Bom gancho para SIPAT e campanhas de qualidade de vida.',
      categorias: [catId['squeezes'], catId['infantil']],
      ecologico: false,
      selos: { livreDeBpa: true, usoPermanente: true, reciclavel: true },
      cores: [{ nome: 'Standard' }, { nome: 'Neon' }, { nome: 'Metalizado' }],
      imagens: imagemIds,
      faixaPreco: '4-a-15',
      destaques: ['mais-vendido'],
      canais: { site: true, tabelaRevenda: true, tabelaB2B: true },
      logistica: {
        ncm: '3924.90.00',
        dimensoes: '7 (L) x 7 (C) x 13,5 (A) cm',
        pesoUnitario: '33 g',
        materiaPrima: 'PEAD + PEBD',
        modeloCaixaMaster: 'EM.00014',
        qtdPorCaixa: 100,
        dimensoesCaixaMaster: '37,0 x 37,0 x 56,5 cm',
        pesoCaixaMaster: '3,76 kg',
      },
      impressao: {
        metodos: 'Heat transfer e Serigrafia Cilindrica',
        areaTransfer: '1 Lado: 75 (L) x 50 (A) mm; 2 Lados: 226 (L) x 50 (A) mm',
        areaTampografia: 'Nao se aplica',
        areaSerigrafia: '1 lado: 90 (L) x 48 (A) mm; 2 Lados: 200 (L) x 48 (A) mm',
        sleeve: 'N/A',
      },
    },
  })

  payload.logger.info(`Produto piloto criado: id=${produto.id} slug=squeeze-300ml-personalizado`)
}

try {
  await run()
  process.exit(0)
} catch (err) {
  console.error('Falha no seed do produto Squeeze:', err)
  process.exit(1)
}
