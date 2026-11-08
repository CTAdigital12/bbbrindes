import React from 'react'
import type { ListViewServerProps } from 'payload'
import { DefaultListView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductsListBoundary } from '../friendly/NativeProductViews'
import { nativeListProps } from '../friendly/native-product-props'
import { readRevendedores } from './revendedores-server'
import { RevendedorList } from './RevendedorList'
// Lista amigavel dos revendedores (portal de revenda). Em drawer (escolher
// revendedor em outra tela) o Payload mantem o controle (fronteira nativa).
// Leitura co-localizada: readRevendedores (depth 0, overrideAccess:false + user).
export default async function RevendedorListView(props: ListViewServerProps) {
  if (!props.user) redirect('/admin/login')
  const revendedores = await readRevendedores({ payload: props.payload, user: props.user })
  const rights = props.permissions?.collections?.revendedores
  const friendly = <RevendedorList initial={revendedores} canCreate={props.hasCreatePermission} canUpdate={Boolean(rights?.update)} />
  return <ProductsListBoundary friendly={friendly} native={<DefaultListView {...nativeListProps(props)} />} />
}
