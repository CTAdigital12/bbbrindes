import type { Payload, TypedUser } from 'payload'
import type { Banner, Category, Media, Product } from './model'
export type AdminContext = { payload: Payload; user: TypedUser }
export async function readProducts({ payload, user }: AdminContext): Promise<Product[]> {
  const rows: Product[] = []
  let page = 1
  let hasNext = true
  while (hasNext) {
    const result = await payload.find({ collection: 'produtos', depth: 1, limit: 500, page, sort: 'nome', overrideAccess: false, user })
    rows.push(...result.docs as unknown as Product[])
    hasNext = result.hasNextPage; page++
  }
  return rows
}
export async function readCategories({ payload, user }: AdminContext): Promise<Category[]> {
  const result = await payload.find({ collection: 'categorias', depth: 1, limit: 1000, sort: 'nome', overrideAccess: false, user })
  return result.docs as unknown as Category[]
}
export async function readDashboard(context: AdminContext) {
  const { payload, user } = context
  const [products, banners, media, config] = await Promise.all([
    readProducts(context),
    payload.find({ collection: 'hero-slides', depth: 1, limit: 100, sort: 'ordem', overrideAccess: false, user }),
    payload.find({ collection: 'media', depth: 0, limit: 10, sort: '-updatedAt', overrideAccess: false, user }),
    payload.findGlobal({ slug: 'configuracoes', depth: 0, overrideAccess: false, user }),
  ])
  return { products, banners: banners.docs as unknown as Banner[], media: media.docs as unknown as Media[], mediaCount: media.totalDocs, certifications: config.selos?.length ?? 0 }
}
