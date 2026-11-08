import React from 'react'
import type { DocumentViewServerProps } from 'payload'
import { redirect } from 'next/navigation'
import { ProductEditBoundary } from '../friendly/NativeProductViews'
import { nativeEditProps } from '../friendly/native-product-props'
import { DefaultEditView } from '@payloadcms/ui'
import { ConfiguracoesEditor } from './ConfiguracoesEditor'
import type { ConfigContent } from './configuracoes-model'
// View amigavel do global `configuracoes`. Le o global pela Local API com
// overrideAccess:false + user (permissoes reais) e entrega ao editor. Dentro de
// drawer cai no DefaultEditView nativo (ProductEditBoundary). Registrada no global
// em admin.components.views.edit.root.
export default async function ConfiguracoesEditView(props: DocumentViewServerProps) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const config = await req.payload.findGlobal({ slug: 'configuracoes', depth: 0, overrideAccess: false, user: req.user }) as unknown as ConfigContent
  const rights = props.permissions?.globals?.['configuracoes']
  return <ProductEditBoundary friendly={<ConfiguracoesEditor initial={config} canSave={Boolean(rights?.update)} />} native={<DefaultEditView {...nativeEditProps(props)} />} />
}
