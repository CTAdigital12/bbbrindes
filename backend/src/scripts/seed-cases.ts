// Popula a collection `cases` com os 6 cases reais do cliente (doc "ok_cases de
// sucesso"). SEM imagem (decisao Fabio 27/10: cases text-only por ora). slug
// auto-gera do titulo. DB-only, idempotente por (cliente+titulo).
//
// Uso (na pasta backend/):
//   DRY:  CASE_DRY=1 PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-cases.ts
//   REAL:           PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-cases.ts

import { getPayload } from 'payload'
import config from '@payload-config'

const DRY = process.env.CASE_DRY === '1'

type C = { cliente: string; titulo: string; segmento: string; resumo: string }
const CASES: C[] = [
  {
    cliente: 'Coca-Cola',
    titulo: 'Talheres personalizados para campanha de Natal',
    segmento: 'Bebidas · Campanha de Natal',
    resumo:
      'Um utensílio do cotidiano integrado à experiência de uma campanha sazonal, parte de uma relação com a Coca-Cola construída ao longo de mais de 25 anos.',
  },
  {
    cliente: 'Del Valle',
    titulo: 'Mini bowl colecionável para Volta às Aulas',
    segmento: 'Bebidas · Volta às Aulas',
    resumo:
      'Funcionalidade e identidade visual em um produto conectado à rotina escolar, para uma campanha sazonal da Del Valle.',
  },
  {
    cliente: 'Nescafé Dolce Gusto',
    titulo: 'Porta-cápsulas para o e-commerce oficial',
    segmento: 'Bebidas · E-commerce',
    resumo:
      'Design e organização como parte da experiência de consumo de café: diversos formatos de porta-cápsulas desenvolvidos para o e-commerce oficial da marca.',
  },
  {
    cliente: 'Nestlé',
    titulo: 'Bowl Coração personalizado',
    segmento: 'Alimentos · Relacionamento',
    resumo:
      'Um formato diferenciado para unir utilidade e expressão de marca, onde a própria geometria do produto participa da comunicação.',
  },
  {
    cliente: 'Stella Artois',
    titulo: 'Réplica da taça personalizada',
    segmento: 'Bebidas · Ativação de marca',
    resumo:
      'Desenvolvimento industrial em SAN (injeção e sopro) com acabamento em hot stamping, para levar a taça da marca a ambientes onde o vidro não era permitido.',
  },
  {
    cliente: 'Coca-Cola',
    titulo: 'Abridor Contour personalizado',
    segmento: 'Bebidas · Brinde funcional',
    resumo:
      'A identidade da garrafa Contour aplicada a um acessório funcional em ABS, unindo referência visual reconhecível e utilidade.',
  },
]

const payload = await getPayload({ config })

try {
  let done = 0
  const pulados: string[] = []
  for (const c of CASES) {
    const existe = await payload.find({
      collection: 'cases',
      where: { and: [{ cliente: { equals: c.cliente } }, { titulo: { equals: c.titulo } }] },
      depth: 0,
      limit: 1,
    })
    if (existe.docs.length) {
      pulados.push(`${c.cliente} / ${c.titulo}`)
      continue
    }
    if (DRY) {
      payload.logger.info(`[DRY] cria: ${c.cliente} - ${c.titulo}`)
      done++
      continue
    }
    await payload.create({ collection: 'cases', data: c })
    payload.logger.info(`OK: ${c.cliente} - ${c.titulo}`)
    done++
  }
  payload.logger.info(`${DRY ? '[DRY RUN] ' : ''}OK. criados: ${done} | pulados: ${pulados.length}`)
  process.exit(0)
} catch (err) {
  console.error('Falha no seed de cases:', err)
  process.exit(1)
}
