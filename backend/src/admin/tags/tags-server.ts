import type { Payload, TypedUser } from 'payload'
import type { TagRow } from './tags-model'
// Leitura co-locada das tags (padrao do server-data do admin, mas aqui so para tags).
// Alem das tags, conta em quantos conteudos cada uma e usada (relacao tags em
// posts, cases e imprensa). A contagem e opcional: se falhar, a lista ainda abre.
export type TagsContext = { payload: Payload; user: TypedUser }
type ComTags = { tags?: (number | { id?: number } | null)[] }
async function contarUsos({ payload, user }: TagsContext): Promise<Map<number, number>> {
  const [posts, cases, imprensa] = await Promise.all([
    payload.find({ collection: 'posts', depth: 0, limit: 1000, overrideAccess: false, user }),
    payload.find({ collection: 'cases', depth: 0, limit: 1000, overrideAccess: false, user }),
    payload.find({ collection: 'imprensa', depth: 0, limit: 1000, overrideAccess: false, user }),
  ])
  const counts = new Map<number, number>()
  const tally = (docs: unknown[]) => {
    for (const doc of docs as ComTags[]) for (const ref of doc.tags ?? []) {
      const id = typeof ref === 'number' ? ref : ref?.id
      if (id != null) counts.set(id, (counts.get(id) ?? 0) + 1)
    }
  }
  tally(posts.docs); tally(cases.docs); tally(imprensa.docs)
  return counts
}
export async function readTags(context: TagsContext): Promise<TagRow[]> {
  const { payload, user } = context
  const tags = await payload.find({ collection: 'tags', depth: 0, limit: 1000, sort: 'nome', overrideAccess: false, user })
  const rows = tags.docs as unknown as TagRow[]
  try {
    const counts = await contarUsos(context)
    return rows.map(tag => ({ ...tag, usosCount: counts.get(tag.id) ?? 0 }))
  } catch {
    return rows
  }
}
