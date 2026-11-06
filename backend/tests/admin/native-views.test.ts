import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ProductEditBoundary, ProductsListBoundary } from '../../src/admin/friendly/NativeProductViews'
import { nativeEditProps, nativeListProps } from '../../src/admin/friendly/native-product-props'
const drawer = vi.hoisted(() => ({ list: false, document: '' }))
vi.mock('@payloadcms/ui', () => ({ useListDrawerContext: () => ({ isInDrawer: drawer.list }), useDocumentDrawerContext: () => ({ drawerSlug: drawer.document }) }))
const friendly = React.createElement('div', null, 'Pagina aprovada')
const native = React.createElement('div', null, 'Formulario nativo com selecao e callbacks')
describe('compatibilidade dos seletores de Produtos', () => {
 it('mantem o layout aprovado nas paginas completas', () => {
  drawer.list = false; drawer.document = ''
  expect(ProductsListBoundary({ friendly, native })).toBe(friendly)
  expect(ProductEditBoundary({ friendly, native })).toBe(friendly)
 })
 it('mantem selecao e filtros nativos ao escolher produtos de outra tela', () => {
  drawer.list = true
  expect(ProductsListBoundary({ friendly, native })).toBe(native)
 })
 it('mantem o formulario nativo dentro de um drawer, sem redirecionar o pai', () => {
  drawer.document = 'produto-na-campanha'
  expect(ProductEditBoundary({ friendly, native })).toBe(native)
 })
 it('preserva slots/filtros e nao serializa objetos ou identidade do servidor na lista', () => {
  const source = { collectionSlug: 'produtos', Table: native, renderedFilters: new Map([['nome', native]]), enableRowSelections: true, columnState: [], payload: { connection: 'server-only' }, req: { headers: {} }, user: { email: 'server-only' }, permissions: { collections: {} } }
  const props = nativeListProps(source as never)
  expect(props.Table).toBe(native); expect(props.renderedFilters).toBe(source.renderedFilters)
  expect(props.enableRowSelections).toBe(true)
  for (const key of ['payload', 'req', 'user', 'permissions']) expect(props).not.toHaveProperty(key)
 })
 it('preserva formulario e controles do Payload sem enviar req ou documento completo', () => {
  const source = { formState: { nome: { value: 'Produto' } }, SaveButton: native, Status: native, viewType: 'document', documentSubViewType: 'default', req: { user: {} }, payload: {}, doc: { crm: { estoque: 10 } }, initPageResult: {} }
  const props = nativeEditProps(source as never)
  expect(props.formState).toBe(source.formState); expect(props.SaveButton).toBe(native); expect(props.Status).toBe(native)
  for (const key of ['payload', 'req', 'doc', 'initPageResult']) expect(props).not.toHaveProperty(key)
 })
})
