import React from 'react'
import type { ListViewServerProps } from 'payload'
import { DefaultListView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductsListBoundary } from '../friendly/NativeProductViews'
import { nativeListProps } from '../friendly/native-product-props'
import { readUsers } from './users-server'
import { UserList } from './UserList'
// Lista amigavel dos administradores do painel. O usuario logado nao pode remover a
// propria conta (garante que sempre sobra pelo menos um admin).
export default async function UserListView(props: ListViewServerProps) {
  if (!props.user) redirect('/admin/login')
  const users = await readUsers({ payload: props.payload, user: props.user })
  const rights = props.permissions?.collections?.users
  const friendly = <UserList initial={users} canCreate={props.hasCreatePermission} canUpdate={Boolean(rights?.update)} canDelete={Boolean(rights?.delete)} currentUserId={typeof props.user.id === 'number' ? props.user.id : undefined} />
  return <ProductsListBoundary friendly={friendly} native={<DefaultListView {...nativeListProps(props)} />} />
}
