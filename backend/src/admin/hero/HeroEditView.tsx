import React from 'react'
import type { DocumentViewServerProps, PayloadRequest } from 'payload'
import { DefaultEditView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductEditBoundary } from '../friendly/NativeProductViews'
import { nativeEditProps } from '../friendly/native-product-props'
import { HeroEditor } from './HeroEditor'
import { copyHero, newHero } from './hero-data'
import type { HeroDraft } from './hero-model'
// Editor amigavel do banner. Preserva o formulario nativo dentro de drawers de
// relacionamento e grava com PATCH parcial (overrideAccess:false + user).
export default async function HeroEditView(props: DocumentViewServerProps & { doc?: HeroDraft }) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const id = props.doc?.id ?? props.initPageResult.docID
  const copy = props.searchParams?.copiar
  const initial = await initialHero(req, id, copy)
  const rights = props.permissions?.collections?.['hero-slides']
  const friendly = <HeroEditor key={String(id ?? copy ?? 'novo')} initial={initial} canSave={Boolean(id ? rights?.update : rights?.create)} />
  return <ProductEditBoundary friendly={friendly} native={<DefaultEditView {...nativeEditProps(props)} />} />
}
async function initialHero(req: PayloadRequest, id: number | string | undefined, copy: unknown): Promise<HeroDraft> {
  const sourceID = id ?? (typeof copy === 'string' ? copy : undefined)
  if (!sourceID) return newHero(new Date().getMonth() + 1)
  const banner = await req.payload.findByID({ collection: 'hero-slides', id: sourceID, depth: 1, overrideAccess: false, user: req.user }) as unknown as HeroDraft
  return id ? banner : copyHero(banner)
}
