import React from 'react'
import type { ListViewServerProps } from 'payload'
import { DefaultListView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductsListBoundary } from '../friendly/NativeProductViews'
import { nativeListProps } from '../friendly/native-product-props'
import { readCampanhas } from '../friendly/server-data'
import { CampanhaList } from './CampanhaList'
// Lista amigavel das campanhas. Em drawer (escolher campanha em outra tela) o
// Payload mantem o controle (fronteira nativa).
export default async function CampanhaListView(props: ListViewServerProps) {
  if (!props.user) redirect('/admin/login')
  const campanhas = await readCampanhas({ payload: props.payload, user: props.user })
  const rights = props.permissions?.collections?.campanhas
  const friendly = <CampanhaList initial={campanhas} canCreate={props.hasCreatePermission} canUpdate={Boolean(rights?.update)} />
  return <ProductsListBoundary friendly={friendly} native={<DefaultListView {...nativeListProps(props)} />} />
}
