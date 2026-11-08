import type { AdminContext } from '../friendly/server-data'
import type { DepoimentoRow } from './depoimento-model'
// Leitura co-localizada dos depoimentos, na ordem em que o site exibe (campo `ordem`),
// com a foto resolvida (depth 1). overrideAccess:false + user respeita permissoes.
export async function readDepoimentos({ payload, user }: AdminContext): Promise<DepoimentoRow[]> {
  const result = await payload.find({ collection: 'depoimentos', depth: 1, limit: 1000, sort: 'ordem', overrideAccess: false, user })
  return result.docs as unknown as DepoimentoRow[]
}
