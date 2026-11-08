import { describe, expect, it } from 'vitest'
import { dashboardData } from '../../src/admin/friendly/dashboard-data'
describe('indicadores reais do painel', () => {
 it('conta ausencias e escolhe os destaques do mes com os fixos', () => {
  const products = [{ id: 1, nome: 'Um', codigoSite: '1', imagens: [], cores: [{ nome: 'Azul' }, { nome: 'Verde' }], canais: { site: false } }, { id: 2, nome: 'Dois', codigoSite: '2', imagens: [{ id: 8 }], cores: [] }]
  const banners = [{ id: 1, nome: 'Novembro', mes: 11, ativo: true, imagemDesktop: { id: 3, url: '/imagem' } }, { id: 2, nome: 'Fixo', tipo: 'fixo', ativo: true, imagemMobile: { id: 4 } }, { id: 3, nome: 'Oculto', mes: 11, ativo: false }]
  const data = dashboardData(products, banners, [], 88, 5, 11)
  expect(data.withoutPhoto).toBe(1); expect(data.productsWithMissingColorPhoto).toBe(1); expect(data.bannersWithoutMobile).toBe(1)
  expect(data.unpublished).toBe(1); expect(data.mediaCount).toBe(88); expect(data.certifications).toBe(5)
  expect(data.highlights.map(b => b.id)).toEqual([1,2]); expect(data.activity).toEqual([])
 })
})
