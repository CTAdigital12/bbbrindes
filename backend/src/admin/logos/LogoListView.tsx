import React from 'react'
import type { ListViewServerProps } from 'payload'
import { DefaultListView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductsListBoundary } from '../friendly/NativeProductViews'
import { nativeListProps } from '../friendly/native-product-props'
import { readLogos } from './logos-server'
import { LogoList } from './LogoList'
// Lista amigavel dos logos. Em drawer o Payload mantem o controle (fronteira nativa).
export default async function LogoListView(props: ListViewServerProps) {
  if (!props.user) redirect('/admin/login')
  const logos = await readLogos({ payload: props.payload, user: props.user })
  const rights = props.permissions?.collections?.logos
  const friendly = <LogoList initial={logos} canCreate={props.hasCreatePermission} canUpdate={Boolean(rights?.update)} />
  return <ProductsListBoundary friendly={friendly} native={<DefaultListView {...nativeListProps(props)} />} />
}
