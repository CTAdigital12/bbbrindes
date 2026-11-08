import React from 'react'
import type { ListViewServerProps } from 'payload'
import { DefaultListView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductsListBoundary } from '../friendly/NativeProductViews'
import { nativeListProps } from '../friendly/native-product-props'
import { readOrcamentos } from './orcamento-server'
import { OrcamentoList } from './OrcamentoList'
// Caixa de entrada amigavel dos pedidos de orcamento (logs-entrega). Somente leitura.
export default async function OrcamentoListView(props: ListViewServerProps) {
  if (!props.user) redirect('/admin/login')
  const orcamentos = await readOrcamentos({ payload: props.payload, user: props.user })
  return <ProductsListBoundary friendly={<OrcamentoList initial={orcamentos} />} native={<DefaultListView {...nativeListProps(props)} />} />
}
