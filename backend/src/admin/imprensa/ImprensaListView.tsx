import React from 'react'
import type { ListViewServerProps } from 'payload'
import { DefaultListView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductsListBoundary } from '../friendly/NativeProductViews'
import { nativeListProps } from '../friendly/native-product-props'
import { readImprensa } from './imprensa-server'
import { ImprensaList } from './ImprensaList'
// Lista amigavel das materias. Em drawer (escolher materia em outra tela) o
// Payload mantem o controle (fronteira nativa).
export default async function ImprensaListView(props: ListViewServerProps) {
  if (!props.user) redirect('/admin/login')
  const materias = await readImprensa({ payload: props.payload, user: props.user })
  const friendly = <ImprensaList initial={materias} canCreate={props.hasCreatePermission} />
  return <ProductsListBoundary friendly={friendly} native={<DefaultListView {...nativeListProps(props)} />} />
}
