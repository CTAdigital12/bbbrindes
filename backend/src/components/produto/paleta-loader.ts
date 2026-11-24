// Loader server-side da paleta de cores (secao 2 da spec feature-cores-base-acessorio).
//
// Le a collection `cores-bb` via Local API e devolve uma lista plana de PaletaCor. E a
// fundacao da migracao "paleta vira collection editavel": os consumidores (hoje ainda
// importando a constante CORES_BB) vao passar a receber esta lista por prop/contexto no
// server, ou buscar por REST (GET /api/cores-bb?limit=0&depth=0) no client, em OUTRA track.
//
// Contrato forte: NUNCA lanca. Em lista vazia OU em qualquer erro, cai no FALLBACK (a
// constante cores-bb.ts mapeada para PaletaCor), para o build/admin nao quebrar com a
// collection ainda vazia (antes de rodar o seed).

import config from '@payload-config'
import { getPayload } from 'payload'

import { CORES_BB } from './cores-bb'

export type PaletaCor = {
  codigo: string
  nome: string
  hex?: string
  grupo: string
}

// Fallback = a paleta hardcoded de cores-bb.ts, no shape de PaletaCor. Hex vazio ('')
// vira undefined para manter a semantica de "sem hex" (render especial/auto).
const FALLBACK: PaletaCor[] = CORES_BB.map((c) => ({
  codigo: c.codigo,
  nome: c.nome,
  hex: c.hex || undefined,
  grupo: c.grupo,
}))

export async function getPaleta(): Promise<PaletaCor[]> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'cores-bb',
      limit: 0, // 0 = sem limite (toda a paleta)
      depth: 0,
      sort: 'codigo',
    })

    if (!docs || docs.length === 0) return FALLBACK

    return docs.map((d) => ({
      codigo: String(d.codigo),
      nome: String(d.nome),
      hex: d.hex || undefined,
      grupo: String(d.grupo),
    }))
  } catch {
    // Collection inexistente, banco fora, build sem DB: nunca derruba o consumidor.
    return FALLBACK
  }
}
