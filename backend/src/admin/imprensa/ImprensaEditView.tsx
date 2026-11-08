import React from 'react'
import type { DocumentViewServerProps, PayloadRequest } from 'payload'
import { DefaultEditView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductEditBoundary } from '../friendly/NativeProductViews'
import { nativeEditProps } from '../friendly/native-product-props'
import { ImprensaEditor } from './ImprensaEditor'
import { copyImprensa, newImprensa } from './imprensa-data'
import type { ImprensaDraft } from './imprensa-model'
// Editor amigavel da materia. Preserva o formulario nativo em drawers e grava com
// PATCH parcial (overrideAccess:false + user).
export default async function ImprensaEditView(props: DocumentViewServerProps & { doc?: ImprensaDraft }) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const id = props.doc?.id ?? props.initPageResult.docID
  const copy = props.searchParams?.copiar
  const initial = await initialImprensa(req, id, copy)
  const rights = props.permissions?.collections?.imprensa
  const friendly = <ImprensaEditor key={String(id ?? copy ?? 'novo')} initial={initial} canSave={Boolean(id ? rights?.update : rights?.create)} />
  return <ProductEditBoundary friendly={friendly} native={<DefaultEditView {...nativeEditProps(props)} />} />
}
async function initialImprensa(req: PayloadRequest, id: number | string | undefined, copy: unknown): Promise<ImprensaDraft> {
  const sourceID = id ?? (typeof copy === 'string' ? copy : undefined)
  if (!sourceID) return newImprensa()
  const found = await req.payload.findByID({ collection: 'imprensa', id: sourceID, depth: 1, overrideAccess: false, user: req.user }) as unknown as ImprensaDraft
  return id ? found : copyImprensa(found)
}
