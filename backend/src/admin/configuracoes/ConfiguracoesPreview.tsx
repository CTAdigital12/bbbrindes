'use client'
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { REDE_FIELDS, type ConfigContent } from './configuracoes-model'
// Previa fiel do rodape do site (Footer.tsx): coluna da marca com descricao,
// contatos (WhatsApp/telefone, e-mail, endereco), redes (so as preenchidas),
// faixa de selos e a barra inferior com o CNPJ. Ilustrativa.
export function ConfiguracoesPreview({ config }: { config: ConfigContent }) {
  const c = config.contato ?? {}
  const redes = config.redes ?? {}
  const ativas = REDE_FIELDS.filter(([key]) => (redes[key] ?? '').trim())
  const selos = (config.selos ?? []).map(s => s.nome?.trim()).filter(Boolean) as string[]
  return <div className="bb-cfg-preview">
    <div className="bb-cfg-preview-bar"><b>Prévia do rodapé</b><span className="help">Ilustrativa. Confira o site após publicar.</span></div>
    <div className="bb-cfg-foot">
      <div className="bb-cfg-brand">
        <img src="/admin-brand/bb-brindes.webp" alt="BB Brindes" />
        {config.descricao ? <p className="bb-cfg-desc">{config.descricao}</p> : null}
        <div className="bb-cfg-cons">
          <span><b>WhatsApp</b> {c.telefone || '-'}</span>
          <span><b>E-mail</b> {c.email || '-'}</span>
          <span><b>Fábrica</b> {c.endereco || '-'}</span>
          <span><b>Horário</b> {c.horario || '-'}</span>
        </div>
        {ativas.length ? <div className="bb-cfg-soc">{ativas.map(([key, label]) => <span key={key}>{label}</span>)}</div> : null}
      </div>
      {selos.length ? <div className="bb-cfg-certs">{selos.map((s, i) => <span key={i}>{s}</span>)}</div> : null}
      <div className="bb-cfg-bot">© 2026 BB Brindes, uma empresa Grupo BB{c.cnpj ? `, CNPJ ${c.cnpj}` : ''}</div>
    </div>
  </div>
}
