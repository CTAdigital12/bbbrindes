import React from 'react'
import type { ListViewServerProps } from 'payload'
import { DefaultListView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductsListBoundary } from '../friendly/NativeProductViews'
import { nativeListProps } from '../friendly/native-product-props'
import { readHeroSlides } from '../friendly/server-data'
import { HeroList } from './HeroList'
// Lista amigavel dos banners do hero. Reutiliza a fronteira nativa: dentro de um
// drawer (escolher banner em outra tela) o Payload segue no controle.
export default async function HeroListView(props: ListViewServerProps) {
  if (!props.user) redirect('/admin/login')
  const banners = await readHeroSlides({ payload: props.payload, user: props.user })
  const rights = props.permissions?.collections?.['hero-slides']
  const friendly = <HeroList initial={banners} canCreate={props.hasCreatePermission} canUpdate={Boolean(rights?.update)} />
  return <ProductsListBoundary friendly={friendly} native={<DefaultListView {...nativeListProps(props)} />} />
}
