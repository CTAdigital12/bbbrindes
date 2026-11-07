import React from 'react'
import type { DocumentViewServerProps } from 'payload'
import { DefaultEditView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductEditBoundary } from '../friendly/NativeProductViews'
import { nativeEditProps } from '../friendly/native-product-props'
import { readCategoriasRows } from '../friendly/server-data'
import { CategoriaEditor } from './CategoriaEditor'
import { copyCategoria, newCategoria } from './categoria-data'
import type { CategoriaDraft, CategoriaRow } from './categoria-model'
// Editor amigavel da categoria. Preserva o formulario nativo em drawers e grava com
// PATCH parcial (overrideAccess:false + user). A contagem de produtos vem das linhas.
export default async function CategoriaEditView(props: DocumentViewServerProps & { doc?: CategoriaDraft }) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const id = props.doc?.id ?? props.initPageResult.docID
  const copy = props.searchParams?.copiar
  const rows = await readCategoriasRows({ payload: req.payload, user: req.user })
  const { initial, produtosCount } = resolveInitial(rows, id, copy)
  const rights = props.permissions?.collections?.categorias
  const friendly = <CategoriaEditor key={String(id ?? copy ?? 'novo')} initial={initial} canSave={Boolean(id ? rights?.update : rights?.create)} produtosCount={produtosCount} />
  return <ProductEditBoundary friendly={friendly} native={<DefaultEditView {...nativeEditProps(props)} />} />
}
function resolveInitial(rows: CategoriaRow[], id: number | string | undefined, copy: unknown): { initial: CategoriaDraft; produtosCount: number } {
  const sourceID = id ?? (typeof copy === 'string' ? copy : undefined)
  const found = sourceID != null ? rows.find(row => String(row.id) === String(sourceID)) : undefined
  if (!found) return { initial: newCategoria(), produtosCount: 0 }
  const { produtosCount = 0, ...draft } = found
  return id ? { initial: draft, produtosCount } : { initial: copyCategoria(draft), produtosCount: 0 }
}
