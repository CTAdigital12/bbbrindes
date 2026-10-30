// Cria a tabela da collection `logs-entrega` em producao de forma DETERMINISTICA
// (FB-7). Licao do incidente da quantidade_minima: deploy de schema novo NAO pode
// contar com o push do boot (next start). Este script roda no contexto CLI
// (railway run), onde o push do drizzle roda de verdade.
//
// Rodar na pasta backend/, APOS o railway up da master, com push ligado so pra
// este processo:
//   railway run npx cross-env PAYLOAD_DB_PUSH=true payload run src/scripts/ensure-logs-entrega.ts
//
// getPayload inicializa o adapter do Postgres; com PAYLOAD_DB_PUSH=true ele
// sincroniza o schema e cria a tabela `logs_entrega` + os enums dos campos select
// (status, modo). Idempotente: rodar de novo nao recria nada. Depois, confirmar
// que PAYLOAD_DB_PUSH=false segue no Railway (o start do servico nao muda).

import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
const { totalDocs } = await payload.count({ collection: 'logs-entrega' })
payload.logger.info(`[ensure-logs-entrega] tabela logs_entrega pronta. registros: ${totalDocs}`)
process.exit(0)
