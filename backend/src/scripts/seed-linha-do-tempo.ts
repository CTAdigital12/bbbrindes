// Seed da linha do tempo no global "Conteudo institucional" (FB-6, #107).
//
// Por que existe: o defaultValue do Payload NAO preenche retroativamente um global
// que ja existia ANTES do campo linhaDoTempo ser criado. Em prod o form abre vazio
// (0 marcos) e "Salvar" nao resolve. Este seed aplica os 13 marcos UMA vez.
//
// Fonte dos dados = o proprio defaultValue do campo (sem duplicar literal).
// Idempotente: se linhaDoTempo ja tem itens, NAO sobrescreve (protege edicao manual).
// Preserva os demais campos (Quem somos / SAC) via read-merge-write.
//
// Roda na pasta backend/:
//   npx payload run src/scripts/seed-linha-do-tempo.ts           (contra o banco do .env local)
//   railway run npx payload run src/scripts/seed-linha-do-tempo.ts   (contra o banco de PROD)

import { getPayload } from 'payload'
import config from '@payload-config'

import { ConteudoInstitucional } from '../globals/ConteudoInstitucional'

const run = async () => {
  const payload = await getPayload({ config })

  // 1. Pega os marcos do defaultValue do campo (fonte unica da verdade).
  const campo = (ConteudoInstitucional.fields as Array<Record<string, unknown>>).find(
    (f) => f && f.name === 'linhaDoTempo',
  )
  const marcos = (campo?.defaultValue ?? []) as unknown[]
  if (!Array.isArray(marcos) || marcos.length === 0) {
    payload.logger.error('defaultValue de linhaDoTempo vazio; nada a semear. Abortando.')
    process.exit(1)
  }

  // 2. Le o global atual (depth 0 => relacoes/uploads como id, bom pra reescrever).
  const atual = (await payload.findGlobal({
    slug: 'conteudo-institucional',
    depth: 0,
  })) as Record<string, unknown>

  const existentes = Array.isArray(atual?.linhaDoTempo) ? (atual.linhaDoTempo as unknown[]).length : 0
  if (existentes > 0) {
    payload.logger.info(
      `linhaDoTempo ja tem ${existentes} marco(s); seed idempotente NAO sobrescreve. Nada feito.`,
    )
    return
  }

  // 3. Read-merge-write: mantem os outros campos, so injeta a linha do tempo.
  const { id, createdAt, updatedAt, globalType, ...resto } = atual as Record<string, unknown> & {
    id?: unknown
    createdAt?: unknown
    updatedAt?: unknown
    globalType?: unknown
  }

  await payload.updateGlobal({
    slug: 'conteudo-institucional',
    data: { ...resto, linhaDoTempo: marcos } as never,
  })

  payload.logger.info(`OK: linhaDoTempo semeada com ${marcos.length} marcos.`)
}

try {
  await run()
  process.exit(0)
} catch (err) {
  console.error('Falha no seed da linha do tempo:', err)
  process.exit(1)
}
