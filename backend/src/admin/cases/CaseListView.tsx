import React from 'react'
import type { ListViewServerProps } from 'payload'
import { DefaultListView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductsListBoundary } from '../friendly/NativeProductViews'
import { nativeListProps } from '../friendly/native-product-props'
import { readCases } from './cases-server'
import { CaseList } from './CaseList'
// Lista amigavel dos cases. Em drawer (escolher case em outra tela) o Payload
// mantem o controle (fronteira nativa).
export default async function CaseListView(props: ListViewServerProps) {
  if (!props.user) redirect('/admin/login')
  const cases = await readCases({ payload: props.payload, user: props.user })
  const friendly = <CaseList initial={cases} canCreate={props.hasCreatePermission} />
  return <ProductsListBoundary friendly={friendly} native={<DefaultListView {...nativeListProps(props)} />} />
}
