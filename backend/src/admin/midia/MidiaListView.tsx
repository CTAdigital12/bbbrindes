import React from 'react'
import type { ListViewServerProps } from 'payload'
import { DefaultListView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductsListBoundary } from '../friendly/NativeProductViews'
import { nativeListProps } from '../friendly/native-product-props'
import { MidiaList } from './MidiaList'
// Biblioteca de Midia amigavel. A grade busca as imagens pela API no cliente (como
// o MediaPicker), entao a view so cuida de auth e da fronteira nativa (drawer).
export default async function MidiaListView(props: ListViewServerProps) {
  if (!props.user) redirect('/admin/login')
  const rights = props.permissions?.collections?.media
  const friendly = <MidiaList canUpdate={Boolean(rights?.update)} />
  return <ProductsListBoundary friendly={friendly} native={<DefaultListView {...nativeListProps(props)} />} />
}
