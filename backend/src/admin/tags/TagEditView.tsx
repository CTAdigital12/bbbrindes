import React from 'react'
import type { DocumentViewServerProps } from 'payload'
import { DefaultEditView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductEditBoundary } from '../friendly/NativeProductViews'
import { nativeEditProps } from '../friendly/native-product-props'
import { readTags } from './tags-server'
import { TagEditor } from './TagEditor'
import { copyTag, newTag } from './tags-data'
import type { TagDraft, TagRow } from './tags-model'
// Editor amigavel da tag. Preserva o formulario nativo em drawers e grava com PATCH
// parcial (overrideAccess:false + user). A contagem de usos vem das linhas lidas.
export default async function TagEditView(props: DocumentViewServerProps & { doc?: TagDraft }) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const id = props.doc?.id ?? props.initPageResult.docID
  const copy = props.searchParams?.copiar
  const rows = await readTags({ payload: req.payload, user: req.user })
  const { initial, usosCount } = resolveInitial(rows, id, copy)
  const rights = props.permissions?.collections?.tags
  const friendly = <TagEditor key={String(id ?? copy ?? 'novo')} initial={initial} canSave={Boolean(id ? rights?.update : rights?.create)} usosCount={usosCount} />
  return <ProductEditBoundary friendly={friendly} native={<DefaultEditView {...nativeEditProps(props)} />} />
}
function resolveInitial(rows: TagRow[], id: number | string | undefined, copy: unknown): { initial: TagDraft; usosCount?: number } {
  const sourceID = id ?? (typeof copy === 'string' ? copy : undefined)
  const found = sourceID != null ? rows.find(row => String(row.id) === String(sourceID)) : undefined
  if (!found) return { initial: newTag(), usosCount: 0 }
  const { usosCount, ...draft } = found
  return id ? { initial: draft, usosCount } : { initial: copyTag(draft), usosCount: 0 }
}
