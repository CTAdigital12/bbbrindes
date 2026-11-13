import React from 'react'
import type { DocumentViewServerProps, PayloadRequest } from 'payload'
import { DefaultEditView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductEditBoundary } from '../friendly/NativeProductViews'
import { nativeEditProps } from '../friendly/native-product-props'
import { UserEditor } from './UserEditor'
import { newUser } from './users-data'
import type { UserDraft } from './users-model'
// Editor amigavel do usuario do painel. A senha nunca e carregada (a API nao devolve).
export default async function UserEditView(props: DocumentViewServerProps & { doc?: UserDraft }) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const id = props.doc?.id ?? props.initPageResult.docID
  const initial = await initialUser(req, id)
  const rights = props.permissions?.collections?.users
  const friendly = <UserEditor key={String(id ?? 'novo')} initial={initial} canSave={Boolean(id ? rights?.update : rights?.create)} />
  return <ProductEditBoundary friendly={friendly} native={<DefaultEditView {...nativeEditProps(props)} />} />
}
async function initialUser(req: PayloadRequest, id: number | string | undefined): Promise<UserDraft> {
  if (!id) return newUser()
  const user = await req.payload.findByID({ collection: 'users', id, depth: 0, overrideAccess: false, user: req.user }) as unknown as UserDraft
  return { id: user.id, email: user.email, password: '', role: user.role ?? 'admin', updatedAt: user.updatedAt }
}
