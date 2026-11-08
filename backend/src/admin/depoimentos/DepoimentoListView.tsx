import React from 'react'
import type { ListViewServerProps } from 'payload'
import { DefaultListView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductsListBoundary } from '../friendly/NativeProductViews'
import { nativeListProps } from '../friendly/native-product-props'
import { readDepoimentos } from './depoimentos-server'
import { DepoimentoList } from './DepoimentoList'
// Lista amigavel dos depoimentos. Em drawer o Payload mantem o controle (fronteira nativa).
export default async function DepoimentoListView(props: ListViewServerProps) {
  if (!props.user) redirect('/admin/login')
  const depoimentos = await readDepoimentos({ payload: props.payload, user: props.user })
  const rights = props.permissions?.collections?.depoimentos
  const friendly = <DepoimentoList initial={depoimentos} canCreate={props.hasCreatePermission} canUpdate={Boolean(rights?.update)} />
  return <ProductsListBoundary friendly={friendly} native={<DefaultListView {...nativeListProps(props)} />} />
}
