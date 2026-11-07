import React from 'react'
import type { ListViewServerProps } from 'payload'
import { DefaultListView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductsListBoundary } from '../friendly/NativeProductViews'
import { nativeListProps } from '../friendly/native-product-props'
import { readCategoriasRows } from '../friendly/server-data'
import { CategoriaList } from './CategoriaList'
// Lista amigavel das categorias (com contagem de produtos). Em drawer (escolher
// categoria em outra tela) o Payload mantem o controle (fronteira nativa).
export default async function CategoriaListView(props: ListViewServerProps) {
  if (!props.user) redirect('/admin/login')
  const categorias = await readCategoriasRows({ payload: props.payload, user: props.user })
  const rights = props.permissions?.collections?.categorias
  const friendly = <CategoriaList initial={categorias} canCreate={props.hasCreatePermission} canUpdate={Boolean(rights?.update)} />
  return <ProductsListBoundary friendly={friendly} native={<DefaultListView {...nativeListProps(props)} />} />
}
