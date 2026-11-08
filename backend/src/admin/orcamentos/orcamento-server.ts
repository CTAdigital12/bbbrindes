import type { Payload, TypedUser } from 'payload'
import type { OrcamentoRow } from './orcamento-model'
// Leitura co-localizada do log de entrega (mais recentes primeiro). overrideAccess
// false + user respeita a regra de que so usuario logado le.
export async function readOrcamentos({ payload, user }: { payload: Payload; user: TypedUser }): Promise<OrcamentoRow[]> {
  const result = await payload.find({ collection: 'logs-entrega', depth: 0, limit: 200, sort: '-createdAt', overrideAccess: false, user })
  return result.docs as unknown as OrcamentoRow[]
}
