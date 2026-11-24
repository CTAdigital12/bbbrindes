// Migracao de dados do item 5 (cores base x acessorio, Opcao A da spec).
//
// Liga as flags do group `variacao` nos produtos que ja existem: todos nascem
// SEM acessorio (acessorioNaoPreencher = true) e COM base (baseNaoPreencher =
// false). NAO toca no array `cores` (o bloco base continua exatamente como
// esta: zero migracao de base). Os 45 produtos que de fato tem acessorio sao
// preenchidos depois, na fase de variacoes (item 8), a partir da planilha CIGAM.
//
// Idempotente: pode rodar de novo (so re-seta as duas flags). Faz update
// PARCIAL do group (preserva rotulos/coresAcessorio ja gravados num re-run) e
// nunca mexe em `cores`.
//
// !!! NAO RODAR AQUI. Quem roda em prod e o Fabio, com BACKUP do banco antes
// (projeto Free, sem backup automatico). Rodar DRY primeiro pra conferir a
// contagem, depois o real.
//
// Uso (na pasta backend/):
//   DRY:  DRY=1 PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/migrate-variacao-flags.ts
//   REAL:       PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/migrate-variacao-flags.ts

import { getPayload } from 'payload'
import config from '@payload-config'

const DRY = process.env.DRY === '1'

const payload = await getPayload({ config })

type ProdutoLite = {
  id: string | number
  codigoSite?: string | null
  variacao?: Record<string, unknown> | null
}

try {
  const { docs } = await payload.find({ collection: 'produtos', limit: 1000, depth: 0 })
  let updated = 0

  for (const p of docs as ProdutoLite[]) {
    if (!DRY) {
      await payload.update({
        collection: 'produtos',
        id: p.id,
        // So o group `variacao`: `cores` (bloco base) nao entra no data, entao
        // e preservado. Espalha o variacao existente pra nao apagar rotulos ou
        // coresAcessorio num re-run (no primeiro run o group vem vazio).
        data: {
          variacao: {
            ...(p.variacao ?? {}),
            baseNaoPreencher: false,
            acessorioNaoPreencher: true,
          },
        },
      })
    }
    updated++
  }

  payload.logger.info(
    `${DRY ? '[DRY RUN] ' : ''}produtos: ${docs.length} | flags variacao ${DRY ? 'a ligar' : 'ligadas'}: ${updated}`,
  )
  process.exit(0)
} catch (err) {
  console.error('Falha na migracao de flags de variacao:', err)
  process.exit(1)
}
