"use client"
import React from 'react'
import { isActive, revStatus } from './revendedores-data'
import { nivelLabel, type RevendedorDraft } from './revendedores-model'

// Previa de GESTAO (nao e pagina do site): um cartao com os dados do cadastro e
// o status de acesso. Ativo = login liberado no portal; Em analise = sem acesso.
// Campos vazios aparecem como hifen '-' (nunca travessao).
const dash = (value?: string | null): string => (value && value.trim() ? value.trim() : '-')

function enderecoResumo(e?: RevendedorDraft['enderecoEntrega']): string {
  if (!e) return '-'
  const linha = [e.logradouro, e.bairro].filter(v => v && v.trim()).join(', ')
  const cidadeUf = [e.cidade, e.uf].filter(v => v && v.trim()).join('/')
  const partes = [linha, cidadeUf, e.cep].map(v => (v && v.trim() ? v.trim() : '')).filter(Boolean)
  return partes.length ? partes.join(' - ') : '-'
}

export function RevendedorPreview({ revendedor }: { revendedor: RevendedorDraft }) {
  const [statusKey, statusLabel] = revStatus(revendedor)
  const ativo = isActive(revendedor)
  return <div className="bb-rev-preview">
    <div className="bb-rev-preview-bar"><b>Prévia</b><span className="help">Cartão de gestão. Não aparece no site.</span></div>
    <div className="bb-rev-card">
      <div className="bb-rev-card-head">
        <div>
          <span className="bb-rev-empresa">{revendedor.empresa && revendedor.empresa.trim() ? revendedor.empresa : 'Razão social'}</span>
          <span className="bb-rev-fantasia">{dash(revendedor.nomeFantasia)}</span>
        </div>
        <span className={`st ${statusKey}`}>{statusLabel}</span>
      </div>
      <div className={`bb-rev-acesso ${ativo ? 'on' : ''}`}>{ativo ? 'Acesso liberado ao portal de revenda.' : 'Sem acesso: cadastro em análise.'}</div>
      <dl className="bb-rev-kv">
        <div><b>CNPJ</b><span>{dash(revendedor.cnpj)}</span></div>
        <div><b>Inscrição estadual</b><span>{dash(revendedor.inscricaoEstadual)}</span></div>
        <div><b>Responsável</b><span>{dash(revendedor.responsavel)}</span></div>
        <div><b>Telefone</b><span>{dash(revendedor.telefone)}</span></div>
        <div><b>WhatsApp</b><span>{dash(revendedor.whatsapp)}</span></div>
        <div><b>Site</b><span>{dash(revendedor.site)}</span></div>
        <div><b>E-mail de acesso</b><span>{dash(revendedor.email)}</span></div>
        <div><b>Nível (tabela)</b><span>{revendedor.nivel ? nivelLabel(revendedor.nivel) : '-'}</span></div>
        <div className="full"><b>Endereço de entrega</b><span>{enderecoResumo(revendedor.enderecoEntrega)}</span></div>
      </dl>
      <p className="bb-rev-note">Ativar o revendedor libera o login no portal de revenda e a tabela de preço do nível. Em análise, o cadastro existe mas não acessa.</p>
    </div>
  </div>
}
