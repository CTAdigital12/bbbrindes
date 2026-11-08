import React from 'react'
import type { DocumentViewServerProps, PayloadRequest } from 'payload'
import { DefaultEditView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductEditBoundary } from '../friendly/NativeProductViews'
import { nativeEditProps } from '../friendly/native-product-props'
import { RevendedorEditor } from './RevendedorEditor'
import { newRevendedor } from './revendedores-data'
import type { RevendedorDraft } from './revendedores-model'
// Editor amigavel do revendedor. Preserva o formulario nativo em drawers e grava
// com POST (create) / PATCH parcial (edit), overrideAccess:false + user.
export default async function RevendedorEditView(props: DocumentViewServerProps & { doc?: RevendedorDraft }) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const id = props.doc?.id ?? props.initPageResult.docID
  const initial = await initialRevendedor(req, id)
  const rights = props.permissions?.collections?.revendedores
  const friendly = <RevendedorEditor key={String(id ?? 'novo')} initial={initial} canSave={Boolean(id ? rights?.update : rights?.create)} />
  return <ProductEditBoundary friendly={friendly} native={<DefaultEditView {...nativeEditProps(props)} />} />
}
async function initialRevendedor(req: PayloadRequest, id: number | string | undefined): Promise<RevendedorDraft> {
  if (!id) return newRevendedor()
  const doc = await req.payload.findByID({ collection: 'revendedores', id, depth: 0, overrideAccess: false, user: req.user }) as unknown as RevendedorDraft
  // A API nunca devolve a senha: o campo comeca sempre vazio no editor.
  return { ...doc, password: '' }
}
