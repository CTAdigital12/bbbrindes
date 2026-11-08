import React from 'react'
import type { DocumentViewServerProps, PayloadRequest } from 'payload'
import { DefaultEditView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductEditBoundary } from '../friendly/NativeProductViews'
import { nativeEditProps } from '../friendly/native-product-props'
import { DepoimentoEditor } from './DepoimentoEditor'
import { copyDepoimento, newDepoimento } from './depoimento-data'
import type { DepoimentoDraft } from './depoimento-model'
// Editor amigavel do depoimento. Preserva o formulario nativo em drawers e grava
// com PATCH parcial (overrideAccess:false + user).
export default async function DepoimentoEditView(props: DocumentViewServerProps & { doc?: DepoimentoDraft }) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const id = props.doc?.id ?? props.initPageResult.docID
  const copy = props.searchParams?.copiar
  const initial = await initialDepoimento(req, id, copy)
  const rights = props.permissions?.collections?.depoimentos
  const friendly = <DepoimentoEditor key={String(id ?? copy ?? 'novo')} initial={initial} canSave={Boolean(id ? rights?.update : rights?.create)} />
  return <ProductEditBoundary friendly={friendly} native={<DefaultEditView {...nativeEditProps(props)} />} />
}
async function initialDepoimento(req: PayloadRequest, id: number | string | undefined, copy: unknown): Promise<DepoimentoDraft> {
  const sourceID = id ?? (typeof copy === 'string' ? copy : undefined)
  if (!sourceID) return newDepoimento()
  const depoimento = await req.payload.findByID({ collection: 'depoimentos', id: sourceID, depth: 1, overrideAccess: false, user: req.user }) as unknown as DepoimentoDraft
  return id ? depoimento : copyDepoimento(depoimento)
}
