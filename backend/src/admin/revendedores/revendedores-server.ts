import type { AdminContext } from '../friendly/server-data'
import type { RevendedorRow } from './revendedores-model'

// Leitura co-localizada: lista de revendedores para o /admin.
// depth 0 (sem relacoes a popular), overrideAccess:false + user: o Payload
// aplica o access da collection (PII/LGPD, so o admin ve tudo). Ordena por empresa.
export async function readRevendedores({ payload, user }: AdminContext): Promise<RevendedorRow[]> {
  const result = await payload.find({
    collection: 'revendedores', depth: 0, limit: 1000, sort: 'empresa', overrideAccess: false, user,
  })
  return result.docs as unknown as RevendedorRow[]
}
