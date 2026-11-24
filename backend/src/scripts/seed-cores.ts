// Cadastra o array `cores` (bolinhas de cor do card) de cada produto a partir do
// JSON cores-por-codigo.json, gerado da planilha oficial "PRODUTOS EM LINHA"
// (coluna de cor por SKU). Casa por `codigoSite` (campo unique).
//
// A planilha (JSON) e a fonte de nome + hex das cores. O `codigo` (paleta/CRM)
// e a foto `imagem` ja gravados no produto sao PRESERVADOS (casando pelo nome):
// o seed antigo gravava so {nome,hex} e apagava esses dois. So o bloco base
// (`cores`) e tocado; o group `variacao` (base x acessorio) nunca e mexido.
// Idempotente: pode rodar de novo.
//
// Uso (na pasta backend/):
//   DRY:  CORES_JSON="<abs path do json>" CORES_DRY=1 PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-cores.ts
//   REAL: CORES_JSON="<abs path do json>"             PAYLOAD_DB_PUSH=false node_modules/.bin/payload run src/scripts/seed-cores.ts

import { getPayload } from 'payload'
import config from '@payload-config'
import { readFileSync } from 'fs'

// O JSON da planilha traz nome + hex. `codigo` pode vir preenchido no JSON; se
// nao vier, e preservado do produto (ver merge abaixo).
type Cor = { nome: string; hex?: string; codigo?: string | null }

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

  type CorExistente = { nome?: string; codigo?: string | null; hex?: string | null; imagem?: number | string | null }
  type ProdutoLite = { id: string; codigoSite?: string; slug?: string; cores?: CorExistente[] }

  for (const p of docs as ProdutoLite[]) {
    const code = norm(p.codigoSite)
    const cores = coresPorCod[code]
    if (!cores || cores.length === 0) {
      semMatch.push(`${p.codigoSite ?? '(sem codigo)'} ${p.slug ?? ''}`.trim())
      continue
    }
    if (amostra.length < 6) amostra.push(`${p.codigoSite}: ${cores.length} cores`)
    if (!DRY) {
      // PRESERVA o que o cadastro ja enriqueceu por cor (`codigo` da paleta e a
      // foto `imagem`): o L50 antigo gravava so {nome,hex} e APAGAVA o codigo
      // (e a imagem). A planilha (JSON) manda nome+hex; codigo/imagem vem do
      // que ja esta no produto, casando pelo nome normalizado. So o bloco base
      // (`cores`) e tocado; `variacao` nao entra no data (update parcial).
      const previo = new Map<string, CorExistente>()
      for (const c of p.cores ?? []) previo.set(norm(c.nome), c)

      const corpoCores = cores.map((c) => {
        const anterior = previo.get(norm(c.nome))
        const codigo = c.codigo ?? anterior?.codigo ?? undefined
        const imagem = anterior?.imagem ?? undefined
        const row: { nome: string; hex?: string; codigo?: string; imagem?: number | string } = {
          nome: c.nome,
          hex: c.hex ?? anterior?.hex ?? undefined,
        }
        if (codigo) row.codigo = codigo
        if (imagem != null) row.imagem = imagem
        return row
      })

      await payload.update({
        collection: 'produtos',
        id: p.id,
        data: { cores: corpoCores },
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
