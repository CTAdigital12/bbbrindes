// Cadastra o array `cores` (bolinhas de cor do card) de cada produto a partir do
// JSON cores-por-codigo.json, gerado da planilha oficial "PRODUTOS EM LINHA"
// (coluna de cor por SKU). Casa por `codigoSite` (campo unique).
//
// NAO sobe imagem aqui (cores[].imagem fica vazio); a foto por cor entra num
// passo separado (banco de imagens .webp). Sobrescreve o array `cores` do
// produto pela paleta real da planilha (idempotente: pode rodar de novo).
//
// Uso (na pasta backend/):
//   DRY:  CORES_JSON="<abs path do json>" CORES_DRY=1 PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-cores.ts
//   REAL: CORES_JSON="<abs path do json>"             PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-cores.ts

import { getPayload } from 'payload'
import config from '@payload-config'
import { readFileSync } from 'fs'

type Cor = { nome: string; hex: string }

const jsonPath = process.env.CORES_JSON
const DRY = process.env.CORES_DRY === '1'

if (!jsonPath) {
  console.error('Faltou a env CORES_JSON (caminho absoluto do cores-por-codigo.json).')
  process.exit(1)
}

const coresPorCod: Record<string, Cor[]> = JSON.parse(readFileSync(jsonPath, 'utf-8'))
const norm = (c?: string | null) => (c || '').replace(/\s+/g, ' ').trim().toUpperCase()

const payload = await getPayload({ config })

try {
  const { docs } = await payload.find({ collection: 'produtos', limit: 1000, depth: 0 })
  let updated = 0
  const semMatch: string[] = []
  const amostra: string[] = []

  for (const p of docs as Array<{ id: string; codigoSite?: string; slug?: string }>) {
    const code = norm(p.codigoSite)
    const cores = coresPorCod[code]
    if (!cores || cores.length === 0) {
      semMatch.push(`${p.codigoSite ?? '(sem codigo)'} ${p.slug ?? ''}`.trim())
      continue
    }
    if (amostra.length < 6) amostra.push(`${p.codigoSite}: ${cores.length} cores`)
    if (!DRY) {
      await payload.update({
        collection: 'produtos',
        id: p.id,
        data: { cores: cores.map((c) => ({ nome: c.nome, hex: c.hex })) },
      })
    }
    updated++
  }

  payload.logger.info(
    `${DRY ? '[DRY RUN] ' : ''}produtos: ${docs.length} | com cor ${DRY ? 'a cadastrar' : 'cadastrada'}: ${updated} | sem match: ${semMatch.length}`,
  )
  payload.logger.info('amostra: ' + amostra.join(' | '))
  if (semMatch.length) payload.logger.info('SEM match (ficam sem cor): ' + semMatch.join(', '))
  process.exit(0)
} catch (err) {
  console.error('Falha no seed de cores:', err)
  process.exit(1)
}
