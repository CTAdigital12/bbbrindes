// Aplica o schema PENDENTE no banco de forma deterministica (FB-6/FB-7). Licao do
// incidente: o push do drizzle NAO roda confiavel no boot do next start em prod.
// Este script roda no contexto CLI (railway run), onde o push roda de verdade, e
// `getPayload` com PAYLOAD_DB_PUSH=true cria TODAS as tabelas/colunas que faltam
// (collections E globals novos, incluindo as sub-tabelas de arrays dos globals).
// Idempotente. Generico: use pra qualquer deploy de schema novo.
//
// Rodar na pasta backend/, APOS o railway up da master:
//   railway run npx cross-env PAYLOAD_DB_PUSH=true payload run src/scripts/ensure-schema.ts
// Depois, confirmar que PAYLOAD_DB_PUSH=false segue no Railway (o start do servico nao muda).

import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })
payload.logger.info('[ensure-schema] schema sincronizado (push). Tabelas/colunas pendentes criadas.')
process.exit(0)
