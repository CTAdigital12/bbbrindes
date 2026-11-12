'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { requestJSON } from '../friendly/api'
import { Icon } from '../friendly/icons'
import { HeroImageField } from '../hero/HeroImageField'
import { TagPicker } from '../friendly/TagPicker'
import { plainText, richText } from '../friendly/product-data'
import { postBody, postSaveIssue, validatePost } from './post-data'
import { POST_PATH, tagLabel, toDateInput, type PostDraft, type PostIssue, type Tag } from './post-model'
import { PostPreview } from './PostPreview'
function tagList(p: PostDraft): Tag[] {
  return (p.tags ?? []).filter((t): t is Tag => typeof t === 'object')
}
export function PostEditor({ initial, canSave = true }: { initial: PostDraft; canSave?: boolean }) {
  const router = useRouter()
  const [original, setOriginal] = useState<PostDraft>(initial)
  const [post, setPost] = useState<PostDraft>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<PostIssue>()
  const [message, setMessage] = useState('')
  const [tagPicker, setTagPicker] = useState(false)
  const dirty = JSON.stringify(post) !== JSON.stringify(original)
  const disabled = !canSave || saving
  const tags = tagList(post)
  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])
  useEffect(() => {
    if (!error?.field) return
    const field = document.getElementById(error.field); field?.focus(); field?.scrollIntoView({ block: 'center' })
  }, [error])
  function change(field: string, value: unknown) { setPost(current => ({ ...current, [field]: value })); setMessage(''); setError(undefined) }
  async function save() {
    const issue = validatePost(post)
    if (issue) { setError({ ...issue }); return }
    setSaving(true); setError(undefined); setMessage('')
    try {
      const body = postBody(post, original.id ? original : undefined)
      if (!Object.keys(body).length) { setMessage('Nenhuma alteração para salvar.'); return }
      const result = await requestJSON<{ doc: PostDraft }>(`/api/posts${original.id ? `/${original.id}` : ''}?depth=1`, { method: original.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      setPost(result.doc); setOriginal(result.doc)
      setMessage('Post salvo. O site pode levar alguns minutos para atualizar.')
      if (!original.id && result.doc.id) router.push(`${POST_PATH}/${result.doc.id}`)
    } catch (cause) { setError(postSaveIssue(cause)) } finally { setSaving(false) }
  }
  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>{original.id ? 'Editar post' : 'Adicionar post'}</h1>{original.id ? <Link className="btn" href={`${POST_PATH}/create`}><Icon name="plus" />Adicionar post</Link> : null}<span className="sp" /><Link className="lnk" href={POST_PATH}>Voltar para o Blog</Link></div>
    {error ? <p id="bb-post-error" className="bb-error" role="alert">{error.message}</p> : null}{message ? <p className="bb-success" role="status">{message}</p> : null}
    <div className="prev-wrap"><div className="bb-stack">
      <div className="bb-card"><div className="bd">
        <input id="bb-post-titulo" className="ttl" aria-label="Título do post" aria-invalid={error?.field === 'bb-post-titulo'} placeholder="Título do post" value={post.titulo} disabled={disabled} onChange={e => change('titulo', e.target.value)} />
        <div className="row2" style={{ marginTop: 12 }}>
          <div className="fld"><label htmlFor="bb-post-autor">Autor</label><input className="inp" id="bb-post-autor" value={post.autor || ''} disabled={disabled} onChange={e => change('autor', e.target.value)} /></div>
          <div className="fld"><label htmlFor="bb-post-data">Data</label><input className="inp" id="bb-post-data" type="date" aria-invalid={error?.field === 'bb-post-data'} value={toDateInput(post.data)} disabled={disabled} onChange={e => change('data', e.target.value)} /><span className="help">O blog ordena do mais recente para o mais antigo.</span></div>
        </div>
        <div className="fld"><label htmlFor="bb-post-resumo">Resumo</label><textarea id="bb-post-resumo" rows={3} value={post.resumo || ''} disabled={disabled} onChange={e => change('resumo', e.target.value)} /><span className="help">Chamada curta exibida no card do blog.</span></div>
        <HeroImageField label="Capa do post" help="Imagem de capa exibida no card e no topo do artigo." value={post.capa} disabled={disabled} onChange={v => change('capa', v)} />
        <div className="fld"><label htmlFor="bb-post-conteudo">Conteúdo</label><textarea id="bb-post-conteudo" rows={10} value={plainText(post.conteudo)} disabled={disabled} onChange={e => change('conteudo', richText(e.target.value))} /><span className="help">Texto do artigo. Uma linha em branco separa os parágrafos.</span></div>
        <div className="fld"><span className="lbl">Tags <span className="opt">({tags.length})</span></span>{tags.length ? <div className="bb-blog-chips">{tags.map(t => <span className="bb-blog-chip-rm" key={t.id}>{tagLabel(t)}<button type="button" aria-label={`Remover ${tagLabel(t)}`} disabled={disabled} onClick={() => change('tags', tags.filter(x => x.id !== t.id))}>×</button></span>)}</div> : <span className="help">Nenhuma tag marcada.</span>}<button type="button" className="btn sm" disabled={disabled} onClick={() => setTagPicker(true)}>Gerenciar tags</button><span className="help">Marque as tags deste post. Para criar tags novas, use o menu Tags.</span></div>
      </div><div className="pub"><div className="line" style={{ padding: '0 16px 12px' }}>{dirty ? <span className="bb-warning">Alterações ainda não salvas</span> : <span className="help">Tudo salvo.</span>}</div><div className="foot"><Link className="lnk" href={POST_PATH}>Cancelar</Link><button type="button" className="btn pri" disabled={disabled} onClick={() => void save()}>{saving ? 'Salvando…' : 'Salvar post'}</button></div></div></div>
    </div>
    <div className="prev"><PostPreview post={post} /></div></div>
    {tagPicker ? <TagPicker initial={tags.map(t => ({ id: t.id, nome: tagLabel(t), slug: t.slug }))} onApply={list => change('tags', list)} onClose={() => setTagPicker(false)} /> : null}
  </section></div>
}
