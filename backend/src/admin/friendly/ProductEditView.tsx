import React from 'react'
import type { AdminViewServerProps, PayloadRequest } from 'payload'
import { redirect } from 'next/navigation'
import { ProductEditor } from './ProductEditor'
import { copyProduct } from './product-data'
import type { Product } from './model'
import { readCategories } from './server-data'
export default async function ProductEditView(props: AdminViewServerProps & { doc?: Product }) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const categories = await readCategories({ payload: req.payload, user: req.user })
  const id = documentID(props)
  const copy = props.searchParams?.copiar
  const initial = await initialProduct(req, id, copy)
  const rights = props.permissions?.collections?.produtos
  return <ProductEditor key={String(id ?? copy ?? 'novo')} initial={initial} categories={categories} canSave={Boolean(id ? rights?.update : rights?.create)} />
}

function documentID(props: AdminViewServerProps & { doc?: Product }) {
  return props.doc?.id ?? props.docID ?? props.initPageResult.docID
}
async function initialProduct(req: PayloadRequest, id: number | string | undefined, copy: unknown): Promise<Product> {
  const sourceID = id ?? (typeof copy === 'string' ? copy : undefined)
  if (!sourceID) return { nome: '', codigoSite: '', quantidadeMinima: 500, imagens: [], categorias: [], cores: [], canais: { site: false } }
  const product = await req.payload.findByID({ collection: 'produtos', id: sourceID, depth: 1, overrideAccess: false, user: req.user }) as unknown as Product
  return id ? product : copyProduct(product)
}
