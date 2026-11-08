import React from 'react'
import type { DocumentViewServerProps, PayloadRequest } from 'payload'
import { DefaultEditView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductEditBoundary } from '../friendly/NativeProductViews'
import { nativeEditProps } from '../friendly/native-product-props'
import { LogoEditor } from './LogoEditor'
import { newLogo } from './logo-data'
import type { LogoDraft } from './logo-model'
// Editor amigavel do logo. Preserva o formulario nativo em drawers. Grava nome/ordem
// com PATCH e o arquivo via multipart (overrideAccess:false + user). Sem duplicar:
// e colecao de upload (o arquivo nao se copia sozinho).
export default async function LogoEditView(props: DocumentViewServerProps & { doc?: LogoDraft }) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const id = props.doc?.id ?? props.initPageResult.docID
  const initial = await initialLogo(req, id)
  const rights = props.permissions?.collections?.logos
  const friendly = <LogoEditor key={String(id ?? 'novo')} initial={initial} canSave={Boolean(id ? rights?.update : rights?.create)} />
  return <ProductEditBoundary friendly={friendly} native={<DefaultEditView {...nativeEditProps(props)} />} />
}
async function initialLogo(req: PayloadRequest, id: number | string | undefined): Promise<LogoDraft> {
  if (!id) return newLogo()
  return await req.payload.findByID({ collection: 'logos', id, depth: 0, overrideAccess: false, user: req.user }) as unknown as LogoDraft
}
