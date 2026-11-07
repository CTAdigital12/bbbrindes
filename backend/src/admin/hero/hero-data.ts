import { mediaID } from '../friendly/model'
import { RequestError } from '../friendly/api-errors'
import { MONTHS, type HeroDraft, type HeroIssue } from './hero-model'
const fields = ['nome', 'tipo', 'mes', 'ordem', 'ativo', 'theme', 'tag', 'icone', 'tituloAntes', 'tituloDestaque', 'tituloDepois', 'sub', 'ctaLabel', 'ctaHref', 'imagemDesktop', 'imagemMobile'] as const
export const activeHero = (banner: HeroDraft) => banner.ativo !== false
export const heroPeriod = (banner: HeroDraft) => banner.tipo === 'fixo' ? 'Sempre (fixo)' : MONTHS[(banner.mes ?? 0) - 1] || 'Mês não definido'
export const byHeroOrder = (a: HeroDraft, b: HeroDraft) => (a.ordem ?? 0) - (b.ordem ?? 0)
export const heroStatus = (banner: HeroDraft): [key: 'ok' | 'off', label: string] => activeHero(banner) ? ['ok', 'No ar'] : ['off', 'Inativo']
export function newHero(month: number): HeroDraft {
  return { nome: '', tipo: 'mensal', mes: month, ordem: 0, ativo: false, theme: 'dark', tag: '', icone: 'sparkles', tituloAntes: '', tituloDestaque: '', tituloDepois: '', sub: '', ctaLabel: 'Ver mais', ctaHref: '/catalogo' }
}
export function copyHero(banner: HeroDraft): HeroDraft {
  return { ...banner, id: undefined, updatedAt: undefined, nome: `${banner.nome} (cópia)`, ativo: false }
}
export function heroBody(banner: HeroDraft, original?: HeroDraft): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  for (const field of fields) {
    if (banner[field] !== undefined && (!original || JSON.stringify(banner[field]) !== JSON.stringify(original[field]))) body[field] = banner[field]
  }
  if ('imagemDesktop' in body) body.imagemDesktop = mediaID(banner.imagemDesktop) ?? null
  if ('imagemMobile' in body) body.imagemMobile = mediaID(banner.imagemMobile) ?? null
  return body
}
export function validHeroLink(value: string): boolean {
  if (!value) return true
  if (/[\\\u0000-\u001f]/.test(value)) return false
  if (value.startsWith('/')) return !value.startsWith('//')
  try { return ['http:', 'https:'].includes(new URL(value).protocol) } catch { return false }
}
function monthIssue(banner: HeroDraft): HeroIssue | undefined {
  if (banner.tipo !== 'mensal') return
  const month = banner.mes ?? 0
  if (!Number.isInteger(month) || month < 1 || month > 12) return { message: 'Escolha o mês de destaque deste banner.', field: 'bb-hero-mes' }
}
export function validateHero(banner: HeroDraft): HeroIssue | undefined {
  if (!banner.nome.trim()) return { message: 'Preencha o nome do banner.', field: 'bb-hero-nome' }
  if (!banner.tag.trim()) return { message: 'Preencha a etiqueta exibida acima do título.', field: 'bb-hero-tag' }
  if (!validHeroLink((banner.ctaHref ?? '').trim())) return { message: 'Use um caminho do site, como /catalogo, ou um endereço iniciado por http:// ou https://.', field: 'bb-hero-ctaHref' }
  if (!Number.isFinite(banner.ordem ?? 0)) return { message: 'Informe uma ordem numérica válida.', field: 'bb-hero-ordem' }
  return monthIssue(banner)
}
export function heroSaveIssue(cause: unknown): HeroIssue {
  if (cause instanceof RequestError) {
    const first = cause.fields[0]
    if (first?.path === 'nome') return { message: 'Confira o nome do banner.', field: 'bb-hero-nome' }
    if (first?.path === 'tag') return { message: 'Confira a etiqueta do banner.', field: 'bb-hero-tag' }
    if (cause.fields.length) return { message: 'Confira os campos do banner e tente salvar novamente.' }
  }
  return { message: cause instanceof Error ? cause.message : 'Não foi possível salvar o banner. Tente novamente.' }
}
