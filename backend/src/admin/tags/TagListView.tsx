import React from 'react'
import type { ListViewServerProps } from 'payload'
import { DefaultListView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductsListBoundary } from '../friendly/NativeProductViews'
import { nativeListProps } from '../friendly/native-product-props'
import { readTags } from './tags-server'
import { TagList } from './TagList'
// Lista amigavel das tags (com a contagem de usos). Em drawer (escolher tags em
// outra tela) o Payload mantem o controle (fronteira nativa).
export default async function TagListView(props: ListViewServerProps) {
  if (!props.user) redirect('/admin/login')
  const tags = await readTags({ payload: props.payload, user: props.user })
  const friendly = <TagList initial={tags} canCreate={props.hasCreatePermission} />
  return <ProductsListBoundary friendly={friendly} native={<DefaultListView {...nativeListProps(props)} />} />
}
