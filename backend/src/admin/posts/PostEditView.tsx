import React from 'react'
import type { DocumentViewServerProps, PayloadRequest } from 'payload'
import { DefaultEditView } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import { ProductEditBoundary } from '../friendly/NativeProductViews'
import { nativeEditProps } from '../friendly/native-product-props'
import { PostEditor } from './PostEditor'
import { copyPost, newPost } from './post-data'
import type { PostDraft } from './post-model'
// Editor amigavel do post. Preserva o formulario nativo em drawers e grava com
// PATCH parcial (overrideAccess:false + user).
export default async function PostEditView(props: DocumentViewServerProps & { doc?: PostDraft }) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const id = props.doc?.id ?? props.initPageResult.docID
  const copy = props.searchParams?.copiar
  const initial = await initialPost(req, id, copy)
  const rights = props.permissions?.collections?.posts
  const friendly = <PostEditor key={String(id ?? copy ?? 'novo')} initial={initial} canSave={Boolean(id ? rights?.update : rights?.create)} />
  return <ProductEditBoundary friendly={friendly} native={<DefaultEditView {...nativeEditProps(props)} />} />
}
async function initialPost(req: PayloadRequest, id: number | string | undefined, copy: unknown): Promise<PostDraft> {
  const sourceID = id ?? (typeof copy === 'string' ? copy : undefined)
  if (!sourceID) return newPost()
  const post = await req.payload.findByID({ collection: 'posts', id: sourceID, depth: 1, overrideAccess: false, user: req.user }) as unknown as PostDraft
  return id ? post : copyPost(post)
}
