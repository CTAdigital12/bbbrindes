import type { AdminContext } from '../friendly/server-data'
import type { PostRow } from './post-model'
// Leitura co-localizada do Blog: posts do mais novo pro mais antigo, com capa e
// tags resolvidas (depth 1). overrideAccess:false + user respeita as permissoes.
export async function readPosts({ payload, user }: AdminContext): Promise<PostRow[]> {
  const result = await payload.find({ collection: 'posts', depth: 1, limit: 1000, sort: '-data', overrideAccess: false, user })
  return result.docs as unknown as PostRow[]
}
