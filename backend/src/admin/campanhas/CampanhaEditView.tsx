import React from 'react'
import type { DocumentViewServerProps, PayloadRequest } from 'payload'
import { DefaultEditView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductEditBoundary } from '../friendly/NativeProductViews'
import { nativeEditProps } from '../friendly/native-product-props'
import { CampanhaEditor } from './CampanhaEditor'
import { copyCampanha, newCampanha } from './campanha-data'
import type { CampanhaDraft } from './campanha-model'
// Editor amigavel da campanha. Preserva o formulario nativo em drawers e grava com
// PATCH parcial (overrideAccess:false + user).
export default async function CampanhaEditView(props: DocumentViewServerProps & { doc?: CampanhaDraft }) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const id = props.doc?.id ?? props.initPageResult.docID
  const copy = props.searchParams?.copiar
  const initial = await initialCampanha(req, id, copy)
  const rights = props.permissions?.collections?.campanhas
  const friendly = <CampanhaEditor key={String(id ?? copy ?? 'novo')} initial={initial} canSave={Boolean(id ? rights?.update : rights?.create)} />
  return <ProductEditBoundary friendly={friendly} native={<DefaultEditView {...nativeEditProps(props)} />} />
}
async function initialCampanha(req: PayloadRequest, id: number | string | undefined, copy: unknown): Promise<CampanhaDraft> {
  const sourceID = id ?? (typeof copy === 'string' ? copy : undefined)
  if (!sourceID) return newCampanha()
  const campanha = await req.payload.findByID({ collection: 'campanhas', id: sourceID, depth: 1, overrideAccess: false, user: req.user }) as unknown as CampanhaDraft
  return id ? campanha : copyCampanha(campanha)
}
