import type { AdminContext } from '../friendly/server-data'
import type { CaseRow } from './cases-model'
// Leitura co-localizada dos cases (padrao readCampanhas): find depth:1 (tags e
// logo/imagem expandidos), overrideAccess:false + user. Ordena por cliente.
export async function readCases({ payload, user }: AdminContext): Promise<CaseRow[]> {
  const result = await payload.find({ collection: 'cases', depth: 1, limit: 1000, sort: 'cliente', overrideAccess: false, user })
  return result.docs as unknown as CaseRow[]
}
