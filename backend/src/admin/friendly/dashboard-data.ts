import { missingPhoto, photo, published, type Banner, type Media, type Product } from './model'
export type DashboardData = ReturnType<typeof dashboardData>
export function dashboardData(products: Product[], banners: Banner[], media: Media[], mediaCount: number, certifications: number, month: number) {
  const live = banners.filter(banner => banner.ativo !== false)
  const highlights = [...live.filter(b => b.mes === month), ...live.filter(b => b.tipo === 'fixo')].slice(0, 3)
  const missingColors = products.filter(p => p.cores?.some(color => !color.imagem))
  const activity = [
    ...products.map(p => ({ title: `Produto atualizado: ${p.nome}`, date: p.updatedAt, href: `/admin/collections/produtos/${p.id}` })),
    ...banners.map(b => ({ title: `Banner atualizado: ${b.nome}`, date: b.updatedAt, href: `/admin/collections/hero-slides/${b.id}` })),
    ...media.map(m => ({ title: `Imagem atualizada: ${m.alt || m.filename}`, date: m.updatedAt, href: `/admin/collections/media/${m.id}` })),
  ].filter(item => item.date).sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 6)
  return {
    mediaCount, certifications, activity,
    withoutPhoto: products.filter(missingPhoto).length,
    productsWithMissingColorPhoto: missingColors.length,
    firstMissingColor: missingColors[0]?.id,
    bannersWithoutMobile: live.filter(b => !b.imagemMobile).length,
    unpublished: products.filter(p => !published(p)).length,
    highlights: highlights.map(b => ({ id: b.id, name: b.nome, image: photo(b.imagemDesktop)?.url ?? '', period: b.tipo === 'fixo' ? 'sempre' : 'mensal' })),
  }
}
