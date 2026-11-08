import React from 'react'
import type { DocumentViewServerProps } from 'payload'
import { DefaultEditView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductEditBoundary } from '../friendly/NativeProductViews'
import { nativeEditProps } from '../friendly/native-product-props'
import { InstitucionalEditor } from './InstitucionalEditor'
import type { InstitucionalContent } from './institucional-model'
// View amigavel do global `conteudo-institucional`. Le o global pela Local API com
// overrideAccess:false + user (permissoes reais) e entrega ao editor. Preserva o
// formulario nativo em drawers (ProductEditBoundary). Registrada no global em
// admin.components.views.edit.root.
export default async function InstitucionalEditView(props: DocumentViewServerProps) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const conteudo = await req.payload.findGlobal({ slug: 'conteudo-institucional', depth: 1, overrideAccess: false, user: req.user }) as unknown as InstitucionalContent
  const rights = props.permissions?.globals?.['conteudo-institucional']
  const friendly = <InstitucionalEditor initial={conteudo} canSave={Boolean(rights?.update)} />
  return <ProductEditBoundary friendly={friendly} native={<DefaultEditView {...nativeEditProps(props)} />} />
}
