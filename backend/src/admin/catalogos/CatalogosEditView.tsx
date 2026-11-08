import React from 'react'
import type { DocumentViewServerProps } from 'payload'
import { DefaultEditView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductEditBoundary } from '../friendly/NativeProductViews'
import { nativeEditProps } from '../friendly/native-product-props'
import { CatalogosEditor } from './CatalogosEditor'
import type { CatalogoContent } from './catalogos-model'
// View amigavel do global `catalogos`. Le o global pela Local API com
// overrideAccess:false + user (permissoes reais) e entrega ao editor. Dentro de
// drawer cai no DefaultEditView nativo (ProductEditBoundary). Registrada no global
// em admin.components.views.edit.root.
export default async function CatalogosEditView(props: DocumentViewServerProps) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const cat = await req.payload.findGlobal({ slug: 'catalogos', depth: 0, overrideAccess: false, user: req.user }) as unknown as CatalogoContent
  const rights = props.permissions?.globals?.['catalogos']
  return <ProductEditBoundary friendly={<CatalogosEditor initial={cat} canSave={Boolean(rights?.update)} />} native={<DefaultEditView {...nativeEditProps(props)} />} />
}
