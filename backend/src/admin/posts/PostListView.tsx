import React from 'react'
import type { ListViewServerProps } from 'payload'
import { DefaultListView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductsListBoundary } from '../friendly/NativeProductViews'
import { nativeListProps } from '../friendly/native-product-props'
import { readPosts } from './posts-server'
import { PostList } from './PostList'
// Lista amigavel do Blog. Em drawer (escolher post em outra tela) o Payload mantem
// o controle (fronteira nativa).
export default async function PostListView(props: ListViewServerProps) {
  if (!props.user) redirect('/admin/login')
  const posts = await readPosts({ payload: props.payload, user: props.user })
  const friendly = <PostList initial={posts} canCreate={props.hasCreatePermission} />
  return <ProductsListBoundary friendly={friendly} native={<DefaultListView {...nativeListProps(props)} />} />
}
