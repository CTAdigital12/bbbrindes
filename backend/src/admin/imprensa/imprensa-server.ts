import type { AdminContext } from '../friendly/server-data'
import type { ImprensaRow } from './imprensa-model'
// Leitura co-localizada das materias (padrao readCampanhas): find depth:1 (tags
// expandidas), overrideAccess:false + user. Ordena pela data decrescente (igual
// ao defaultSort da collection e ao que o site usa).
export async function readImprensa({ payload, user }: AdminContext): Promise<ImprensaRow[]> {
  const result = await payload.find({ collection: 'imprensa', depth: 1, limit: 1000, sort: '-data', overrideAccess: false, user })
  return result.docs as unknown as ImprensaRow[]
}
