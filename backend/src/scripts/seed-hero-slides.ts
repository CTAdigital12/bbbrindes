// Seed dos 14 banners do hero (collection `hero-slides`, FB-6 midia), portados
// VERBATIM de frontend/src/data/home-joy.ts (MESES + FIXOS). O titulo foi quebrado
// nas 3 partes (antes/destaque/depois): o destaque era o <span class="hl">..</span>
// e os &nbsp; viraram espaco normal (o anti-viuva fica no front). As imagens sobem
// pra Media (R2 + webp) a partir de frontend/public/img/banners/home-hero-<key>.webp
// (desktop) e home-hero-mobile-<key>.webp (mobile). Idempotente: reusa Media por
// filename e pula o slide que ja existe (por nome).
//
// Rodar na pasta backend/ (via railway run, pra usar o R2 de prod):
//   railway run npx payload run src/scripts/seed-hero-slides.ts

import path from 'path'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'
import config from '@payload-config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const BANNERS = path.resolve(dirname, '../../../frontend/public/img/banners')

type Slide = {
  nome: string
  tipo: 'mensal' | 'fixo'
  mes?: number
  ordem: number
  theme: 'dark' | 'cream'
  tag: string
  icone: string
  tituloAntes: string
  tituloDestaque: string
  tituloDepois: string
  sub: string
  ctaLabel: string
  ctaHref: string
  key: string
}

const SLIDES: Slide[] = [
  { nome: 'Janeiro · Volta as aulas', tipo: 'mensal', mes: 1, ordem: 1, theme: 'dark', tag: 'Volta às aulas + verão', icone: 'sun', tituloAntes: 'O verão inteiro com a ', tituloDestaque: 'sua marca', tituloDepois: '', sub: 'Squeezes e copos personalizados para hidratar equipes, alunos e clientes nos dias quentes.', ctaLabel: 'Ver squeezes', ctaHref: '/catalogo?categoria=squeezes', key: '01-jan-volta-as-aulas' },
  { nome: 'Fevereiro · Carnaval', tipo: 'mensal', mes: 2, ordem: 2, theme: 'cream', tag: 'Carnaval', icone: 'sparkles', tituloAntes: 'Sua marca no ', tituloDestaque: 'bloco inteiro', tituloDepois: '', sub: 'Copos e squeezes resistentes para eventos, festas e ações de rua com a sua logomarca.', ctaLabel: 'Ver brindes para eventos', ctaHref: '/campanha/carnaval', key: '02-fev-carnaval' },
  { nome: 'Março · Consumidor e Água', tipo: 'mensal', mes: 3, ordem: 3, theme: 'dark', tag: 'Dia do Consumidor · Dia da Água', icone: 'droplet', tituloAntes: 'Água por perto, ', tituloDestaque: 'marca na memória', tituloDepois: '', sub: 'Squeezes reutilizáveis e livres de BPA para as campanhas de março com quem consome a sua marca.', ctaLabel: 'Ver squeezes', ctaHref: '/catalogo?categoria=squeezes', key: '03-mar-consumidor-e-agua' },
  { nome: 'Abril · Páscoa', tipo: 'mensal', mes: 4, ordem: 4, theme: 'cream', tag: 'Páscoa', icone: 'egg', tituloAntes: 'Páscoa que fica ', tituloDestaque: 'depois do chocolate', tituloDepois: '', sub: 'Bowls e brindes infantis personalizados para ações com clientes, colaboradores e famílias.', ctaLabel: 'Ver linha infantil', ctaHref: '/catalogo?categoria=infantil', key: '04-abr-pascoa' },
  { nome: 'Maio · Dia das Mães', tipo: 'mensal', mes: 5, ordem: 5, theme: 'dark', tag: 'Dia das Mães', icone: 'heart', tituloAntes: 'Homenagem que vai para a ', tituloDestaque: 'mesa do café', tituloDepois: '', sub: 'Canecas e xícaras personalizadas para celebrar as mães da sua equipe e da sua carteira.', ctaLabel: 'Ver brindes para Dia das Mães', ctaHref: '/campanha/dia-das-maes', key: '05-mai-dia-das-maes' },
  { nome: 'Junho · Festa Junina', tipo: 'mensal', mes: 6, ordem: 6, theme: 'cream', tag: 'Festas juninas + inverno', icone: 'snowflake', tituloAntes: 'Arraiá quentinho com a ', tituloDestaque: 'sua marca', tituloDepois: '', sub: 'Canecas térmicas personalizadas para as festas de junho e para os dias frios do escritório.', ctaLabel: 'Ver canecas', ctaHref: '/catalogo?categoria=canecas-xicaras', key: '06-jun-festa-junina' },
  { nome: 'Julho · SIPAT', tipo: 'mensal', mes: 7, ordem: 7, theme: 'dark', tag: 'SIPAT', icone: 'helmet', tituloAntes: 'Segurança lembrada ', tituloDestaque: 'o ano todo', tituloDepois: '', sub: 'Squeezes e copos que mantêm a mensagem da SIPAT na rotina do colaborador depois da semana.', ctaLabel: 'Ver brindes para SIPAT', ctaHref: '/catalogo?categoria=squeezes', key: '07-jul-sipat' },
  { nome: 'Agosto · Dia dos Pais', tipo: 'mensal', mes: 8, ordem: 8, theme: 'cream', tag: 'Dia dos Pais', icone: 'tie', tituloAntes: 'Presente que entra ', tituloDestaque: 'na rotina dele', tituloDepois: '', sub: 'Canecas, copos e itens to go personalizados para homenagear os pais da sua empresa.', ctaLabel: 'Ver brindes para Dia dos Pais', ctaHref: '/campanha/dia-dos-pais', key: '08-ago-dia-dos-pais' },
  { nome: 'Setembro · Dia do Cliente', tipo: 'mensal', mes: 9, ordem: 9, theme: 'dark', tag: 'Dia do Cliente', icone: 'gift', tituloAntes: 'Agradeça a quem ', tituloDestaque: 'escolhe a sua marca', tituloDepois: '', sub: 'Kits e canecas personalizados para o Dia do Cliente, de 500 a milhares de unidades.', ctaLabel: 'Ver brindes para Dia do Cliente', ctaHref: '/campanha/dia-do-cliente', key: '09-set-dia-do-cliente' },
  { nome: 'Outubro · Dia das Crianças', tipo: 'mensal', mes: 10, ordem: 10, theme: 'cream', tag: 'Dia das Crianças', icone: 'horse-toy', tituloAntes: 'Brincadeira com a ', tituloDestaque: 'marca da empresa', tituloDepois: '', sub: 'Ioiô, cofrinho, pega-varetas e canecas infantis para ações com os filhos dos colaboradores.', ctaLabel: 'Ver linha infantil', ctaHref: '/campanha/dia-das-criancas', key: '10-out-dia-das-criancas' },
  { nome: 'Novembro · Black Friday', tipo: 'mensal', mes: 11, ordem: 11, theme: 'dark', tag: 'Black Friday', icone: 'tag', tituloAntes: 'Black Friday direto da ', tituloDestaque: 'fábrica', tituloDepois: '', sub: 'Copos, canecas, squeezes e bowls personalizados com produção própria e entrega nacional.', ctaLabel: 'Ver todos os produtos', ctaHref: '/catalogo', key: '11-nov-black-friday' },
  { nome: 'Dezembro · Natal', tipo: 'mensal', mes: 12, ordem: 12, theme: 'dark', tag: 'Natal', icone: 'christmas-tree', tituloAntes: 'Brindes de Natal que ', tituloDestaque: 'ficam em uso', tituloDepois: '', sub: 'Kits, canecas e bowls personalizados que continuam na mesa do cliente em janeiro.', ctaLabel: 'Ver brindes de Natal', ctaHref: '/campanha/natal', key: '12-dez-natal' },
  { nome: 'Fixo · Fábrica própria', tipo: 'fixo', ordem: 13, theme: 'dark', tag: 'Fábrica própria', icone: 'building-factory-2', tituloAntes: 'Somos ', tituloDestaque: 'fábrica,', tituloDepois: ' não revenda', sub: 'Mais de 25 anos fabricando brindes personalizados no Brasil, com homologação Nestlé e Coca-Cola.', ctaLabel: 'Conheça a BB', ctaHref: '/quem-somos', key: 'fixo-1-fabrica-propria' },
  { nome: 'Fixo · Linha ecológica', tipo: 'fixo', ordem: 14, theme: 'cream', tag: 'Linha ecológica', icone: 'leaf', tituloAntes: 'Brindes que ', tituloDestaque: 'duram,', tituloDepois: ' não descartáveis', sub: 'Produtos reutilizáveis, recicláveis e livres de BPA, fabricados no Brasil.', ctaLabel: 'Ver linha ecológica', ctaHref: '/catalogo?categoria=green-fibras', key: 'fixo-2-linha-ecologica' },
]

const payload = await getPayload({ config })

async function mediaId(arquivo: string): Promise<number | null> {
  const full = path.join(BANNERS, arquivo)
  const existe = await payload.find({
    collection: 'media',
    where: { filename: { equals: arquivo } },
    limit: 1,
  })
  if (existe.totalDocs > 0) return existe.docs[0].id as number
  try {
    const doc = await payload.create({
      collection: 'media',
      data: { alt: arquivo.replace(/\.webp$/, '').replace(/-/g, ' ') },
      filePath: full,
    })
    return doc.id as number
  } catch (err) {
    payload.logger.warn(`[seed-hero-slides] imagem ausente/erro (${arquivo}): ${(err as Error).message}`)
    return null
  }
}

let criados = 0
for (const s of SLIDES) {
  const existe = await payload.find({
    collection: 'hero-slides',
    where: { nome: { equals: s.nome } },
    limit: 1,
  })
  if (existe.totalDocs > 0) continue

  const imagemDesktop = await mediaId(`home-hero-${s.key}.webp`)
  const imagemMobile = await mediaId(`home-hero-mobile-${s.key}.webp`)

  await payload.create({
    collection: 'hero-slides',
    data: {
      nome: s.nome,
      tipo: s.tipo,
      mes: s.mes,
      ordem: s.ordem,
      ativo: true,
      theme: s.theme,
      tag: s.tag,
      icone: s.icone,
      tituloAntes: s.tituloAntes,
      tituloDestaque: s.tituloDestaque,
      tituloDepois: s.tituloDepois,
      sub: s.sub,
      ctaLabel: s.ctaLabel,
      ctaHref: s.ctaHref,
      imagemDesktop,
      imagemMobile,
    } as any,
  })
  criados++
}

payload.logger.info(`[seed-hero-slides] ${criados} banners criados (de ${SLIDES.length}).`)
process.exit(0)
