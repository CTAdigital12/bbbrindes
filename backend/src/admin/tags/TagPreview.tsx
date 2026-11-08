"use client"
import React from 'react'
import type { TagDraft } from './tags-model'
// Previa simples: a tag como "chip" (igual aparece marcada no conteudo), mais o
// endereco (slug) gerado e em quantos conteudos ela e usada.
export function TagPreview({ tag, usosCount }: { tag: TagDraft; usosCount?: number }) {
  const nome = tag.nome.trim() || 'Nome da tag'
  return <div className="bb-tag-preview">
    <div className="bb-tag-preview-bar"><b>Previa</b><span className="help">Ilustrativa. Confira o site apos publicar.</span></div>
    <div className="bb-tag-chip">{nome}</div>
    <div className="bb-tag-meta">
      <span className="bb-tag-line"><b>Endereco</b> {tag.slug ? <code>{tag.slug}</code> : <span className="bb-tag-empty">gerado ao salvar</span>}</span>
      <span className="bb-tag-line"><b>Usos</b> {usosCount != null ? `${usosCount} conteudo(s)` : '-'}</span>
    </div>
  </div>
}
