import { RequestError } from '../friendly/api-errors'
import type { ConfigContato, ConfigContent, ConfigRedes, ConfigSelo } from './configuracoes-model'
export type ConfigIssue = { message: string; field?: string }
// So digitos: base do link wa.me. O front monta https://wa.me/<whatsapp>, entao o
// campo precisa ser so numeros com DDI (ex.: 5571994160138).
export const onlyDigits = (value?: string) => (value ?? '').replace(/\D/g, '')
export const waLink = (whatsapp?: string) => `https://wa.me/${onlyDigits(whatsapp)}`
// Uma rede so aparece no rodape quando tem URL (vazia = icone escondido).
const rede = (value?: string) => (value ?? '').trim()
const selo = (row: ConfigSelo) => ({ ...(row.id ? { id: row.id } : {}), nome: row.nome ?? '' })
function contatoBody(c: ConfigContato = {}) {
  return { telefone: c.telefone ?? '', whatsapp: c.whatsapp ?? '', email: c.email ?? '', endereco: c.endereco ?? '', horario: c.horario ?? '', cnpj: c.cnpj ?? '' }
}
function redesBody(r: ConfigRedes = {}) {
  return { instagram: rede(r.instagram), linkedin: rede(r.linkedin), facebook: rede(r.facebook), pinterest: rede(r.pinterest), youtube: rede(r.youtube) }
}
// Corpo do update do global: manda TODOS os blocos (estado completo carregado),
// para a atualizacao nunca apagar um campo que a tela nao edita. Preserva o id das
// linhas do array de selos.
export function configBody(config: ConfigContent): Record<string, unknown> {
  return {
    contato: contatoBody(config.contato),
    redes: redesBody(config.redes),
    descricao: config.descricao ?? '',
    selos: (config.selos ?? []).map(selo),
  }
}
// Valida o unico campo obrigatorio do schema (nome do selo) e, como ajuda, avisa
// se o WhatsApp tiver algo alem de numeros (o schema pede so numeros com DDI).
export function validateConfig(config: ConfigContent): ConfigIssue | undefined {
  if ((config.selos ?? []).some(s => !s.nome?.trim())) return { message: 'Em Selos, preencha o nome de todos os itens (ou remova os vazios).', field: 'selos' }
  const whats = config.contato?.whatsapp?.trim()
  if (whats && onlyDigits(whats) !== whats) return { message: 'O WhatsApp deve ter só números, com DDI (ex.: 5571994160138).', field: 'whatsapp' }
  return undefined
}
export function configSaveIssue(cause: unknown): ConfigIssue {
  if (cause instanceof RequestError && cause.fields.length) return { message: 'Confira os campos e tente salvar novamente.' }
  return { message: cause instanceof Error ? cause.message : 'Não foi possível salvar. Tente novamente.' }
}
