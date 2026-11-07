import { mediaID, type MediaRef } from '../friendly/model'
import { RequestError } from '../friendly/api-errors'
import type { HomeContent, HomeEcoBanner, HomeEcoLead, HomeUrgencia } from './home-model'
export type HomeIssue = { message: string; field?: string }
const imgId = (ref: MediaRef | undefined) => mediaID(ref) ?? null
const item = (row: { id?: string; icone?: string; titulo?: string; sub?: string }) => ({ ...(row.id ? { id: row.id } : {}), icone: row.icone ?? '', titulo: row.titulo ?? '', sub: row.sub ?? '' })
function urgenciaBody(g: HomeUrgencia = {}) {
  return { chip: g.chip ?? '', tituloInicio: g.tituloInicio ?? '', tituloDestaque: g.tituloDestaque ?? '', texto: g.texto ?? '', ctaLabel: g.ctaLabel ?? '', ctaHref: g.ctaHref ?? '', imagem: imgId(g.imagem) }
}
function ecoBannerBody(g: HomeEcoBanner = {}) {
  return { eyebrow: g.eyebrow ?? '', titulo: g.titulo ?? '', texto: g.texto ?? '', ctaLabel: g.ctaLabel ?? '', imagem: imgId(g.imagem) }
}
function ecoLeadBody(g: HomeEcoLead = {}) {
  return { eyebrow: g.eyebrow ?? '', titulo: g.titulo ?? '', texto: g.texto ?? '', ctaLabel: g.ctaLabel ?? '', imagem: imgId(g.imagem), linhas: (g.linhas ?? []).map(l => ({ ...(l as { id?: string }).id ? { id: (l as { id?: string }).id } : {}, texto: l.texto ?? '' })) }
}
// Corpo do update do global: manda TODOS os blocos (estado completo carregado),
// para a atualizacao nunca apagar um bloco que esta tela ainda nao edita. Mantem
// os ids das linhas dos arrays e troca as imagens dos grupos pelo id da Media.
export function homeBody(home: HomeContent): Record<string, unknown> {
  return {
    selosConfianca: (home.selosConfianca ?? []).map(item),
    diferenciais: (home.diferenciais ?? []).map(item),
    depoimentos: (home.depoimentos ?? []).map(q => ({ ...(q as { id?: string }).id ? { id: (q as { id?: string }).id } : {}, texto: q.texto ?? '', autor: q.autor ?? '' })),
    faq: (home.faq ?? []).map(f => ({ ...(f as { id?: string }).id ? { id: (f as { id?: string }).id } : {}, pergunta: f.pergunta ?? '', resposta: f.resposta ?? '' })),
    urgencia: urgenciaBody(home.urgencia),
    ecoBanner: ecoBannerBody(home.ecoBanner),
    ecoLead: ecoLeadBody(home.ecoLead),
    ctaFinal: { titulo: home.ctaFinal?.titulo ?? '', texto: home.ctaFinal?.texto ?? '', ctaLabel: home.ctaFinal?.ctaLabel ?? '', ctaHref: home.ctaFinal?.ctaHref ?? '' },
  }
}
// Valida os campos obrigatorios do schema (icone/titulo dos selos e diferenciais,
// texto/autor dos depoimentos, pergunta/resposta do FAQ). Mensagem amigavel PT.
export function validateHome(home: HomeContent): HomeIssue | undefined {
  if ((home.selosConfianca ?? []).some(s => !s.icone || !s.titulo?.trim())) return { message: 'Em Selos de confiança, preencha o ícone e o título de todos os itens.' }
  if ((home.diferenciais ?? []).some(d => !d.icone || !d.titulo?.trim())) return { message: 'Em Diferenciais, preencha o ícone e o título de todos os itens.' }
  if ((home.depoimentos ?? []).some(q => !q.texto?.trim() || !q.autor?.trim())) return { message: 'Em Depoimentos, preencha o texto e o autor de todos os itens.' }
  if ((home.faq ?? []).some(f => !f.pergunta?.trim() || !f.resposta?.trim())) return { message: 'No FAQ, preencha a pergunta e a resposta de todos os itens.' }
  return undefined
}
export function homeSaveIssue(cause: unknown): HomeIssue {
  if (cause instanceof RequestError && cause.fields.length) return { message: 'Confira os campos e tente salvar novamente.' }
  return { message: cause instanceof Error ? cause.message : 'Não foi possível salvar. Tente novamente.' }
}
