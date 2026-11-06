import React from 'react'
import type { ListViewServerProps } from 'payload'
import { redirect } from 'next/navigation'
import { ProductsList } from './ProductsList'
import { readCategories, readProducts } from './server-data'
export default async function ProductsListView(props: ListViewServerProps) {
  if (!props.user) redirect('/admin/login')
  const context = { payload: props.payload, user: props.user }
  const [products, categories] = await Promise.all([readProducts(context), readCategories(context)])
  const requested = props.searchParams?.f
  const initialFilter = typeof requested === 'string' ? requested : 'todos'
  return <ProductsList key={initialFilter} products={products} categories={categories} initialFilter={initialFilter} canCreate={props.hasCreatePermission} canUpdate={Boolean(props.permissions?.collections?.produtos?.update)} />
}
