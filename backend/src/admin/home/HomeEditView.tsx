import React from 'react'
import type { DocumentViewServerProps } from 'payload'
import { redirect } from 'next/navigation'
import { HomeEditor } from './HomeEditor'
import type { HomeContent } from './home-model'
// View amigavel do global `conteudo-home`. Le o global pela Local API com
// overrideAccess:false + user (permissoes reais) e entrega ao editor. Registrada
// no global em admin.components.views.edit.root (feito na Parte 4).
export default async function HomeEditView(props: DocumentViewServerProps) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const home = await req.payload.findGlobal({ slug: 'conteudo-home', depth: 1, overrideAccess: false, user: req.user }) as unknown as HomeContent
  const rights = props.permissions?.globals?.['conteudo-home']
  return <HomeEditor initial={home} canSave={Boolean(rights?.update)} />
}
