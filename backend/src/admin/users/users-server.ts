import type { Payload, TypedUser } from 'payload'
import type { UserRow } from './users-model'
// Leitura co-localizada dos administradores do painel. overrideAccess false + user
// respeita o acesso da colecao (so logado le).
export async function readUsers({ payload, user }: { payload: Payload; user: TypedUser }): Promise<UserRow[]> {
  const result = await payload.find({ collection: 'users', depth: 0, limit: 200, sort: 'email', overrideAccess: false, user })
  return result.docs as unknown as UserRow[]
}
