import { describe, expect, it, vi } from 'vitest'
import DashboardView from '../../src/admin/friendly/DashboardView'
import ProductEditView from '../../src/admin/friendly/ProductEditView'
import ProductsListView from '../../src/admin/friendly/ProductsListView'
vi.mock('@payloadcms/ui', () => ({ DefaultListView: () => null, DefaultEditView: () => null, useListDrawerContext: () => ({}), useDocumentDrawerContext: () => ({}) }))
vi.mock('next/navigation', () => ({ redirect: () => { throw new Error('LOGIN_REQUIRED') } }))
describe('telas privadas', () => {
 it('bloqueia painel e edicao antes de consultar dados sem login', async () => {
  const props = { initPageResult: { req: { user: null } } }
  await expect(DashboardView(props as never)).rejects.toThrow('LOGIN_REQUIRED')
  await expect(ProductEditView(props as never)).rejects.toThrow('LOGIN_REQUIRED')
  await expect(ProductsListView({ user: null } as never)).rejects.toThrow('LOGIN_REQUIRED')
 })
})
