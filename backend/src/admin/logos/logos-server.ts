import type { AdminContext } from '../friendly/server-data'
import type { LogoRow } from './logo-model'
// Leitura co-localizada dos logos, na ordem do marquee (campo `ordem`). Colecao de
// upload: url/filename vem no proprio doc (depth 0 basta). Respeita permissoes.
export async function readLogos({ payload, user }: AdminContext): Promise<LogoRow[]> {
  const result = await payload.find({ collection: 'logos', depth: 0, limit: 1000, sort: 'ordem', overrideAccess: false, user })
  return result.docs as unknown as LogoRow[]
}
