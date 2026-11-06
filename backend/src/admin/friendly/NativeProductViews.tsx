"use client"
import React from 'react'
import { useDocumentDrawerContext, useListDrawerContext } from '@payloadcms/ui'
type Props = { friendly: React.ReactNode; native: React.ReactNode }
// Seletores e formularios embutidos continuam sob controle do Payload, incluindo
// filtros, selecao, callbacks de salvar e atualizacao da relacao no formulario pai.
export function ProductsListBoundary({ friendly, native }: Props) {
  const { isInDrawer } = useListDrawerContext()
  return isInDrawer ? native : friendly
}
export function ProductEditBoundary({ friendly, native }: Props) {
  const { drawerSlug } = useDocumentDrawerContext()
  return drawerSlug ? native : friendly
}
