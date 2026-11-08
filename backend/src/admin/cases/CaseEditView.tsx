import React from 'react'
import type { DocumentViewServerProps, PayloadRequest } from 'payload'
import { DefaultEditView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductEditBoundary } from '../friendly/NativeProductViews'
import { nativeEditProps } from '../friendly/native-product-props'
import { CaseEditor } from './CaseEditor'
import { copyCase, newCase } from './cases-data'
import type { CaseDraft } from './cases-model'
// Editor amigavel do case. Preserva o formulario nativo em drawers e grava com
// PATCH parcial (overrideAccess:false + user).
export default async function CaseEditView(props: DocumentViewServerProps & { doc?: CaseDraft }) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const id = props.doc?.id ?? props.initPageResult.docID
  const copy = props.searchParams?.copiar
  const initial = await initialCase(req, id, copy)
  const rights = props.permissions?.collections?.cases
  const friendly = <CaseEditor key={String(id ?? copy ?? 'novo')} initial={initial} canSave={Boolean(id ? rights?.update : rights?.create)} />
  return <ProductEditBoundary friendly={friendly} native={<DefaultEditView {...nativeEditProps(props)} />} />
}
async function initialCase(req: PayloadRequest, id: number | string | undefined, copy: unknown): Promise<CaseDraft> {
  const sourceID = id ?? (typeof copy === 'string' ? copy : undefined)
  if (!sourceID) return newCase()
  const found = await req.payload.findByID({ collection: 'cases', id: sourceID, depth: 1, overrideAccess: false, user: req.user }) as unknown as CaseDraft
  return id ? found : copyCase(found)
}
