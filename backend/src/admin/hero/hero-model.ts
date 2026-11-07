import type { MediaRef } from '../friendly/model'
export type HeroDraft = {
  id?: number; nome: string; tipo: 'mensal' | 'fixo'; mes?: number | null;
  ordem?: number | null; ativo?: boolean | null; theme?: 'dark' | 'cream' | null;
  tag: string; icone?: string | null; tituloAntes?: string | null;
  tituloDestaque?: string | null; tituloDepois?: string | null; sub?: string | null;
  ctaLabel?: string | null; ctaHref?: string | null; imagemDesktop?: MediaRef;
  imagemMobile?: MediaRef; updatedAt?: string;
}
export type HeroBanner = HeroDraft & { id: number }
export type HeroIssue = { message: string; field?: string }
export const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
// Ícones que o site já desenha na etiqueta do hero (HeroIcon + frontend Icon).
// arrow-right/brand-whatsapp sao do chrome do slide, nao entram como escolha.
export const ICON_OPTIONS: [value: string, label: string][] = [
  ['sparkles', 'Brilho'], ['sun', 'Sol'], ['droplet', 'Gota'], ['egg', 'Ovo'],
  ['heart', 'Coração'], ['snowflake', 'Floco de neve'], ['helmet', 'Capacete'],
  ['tie', 'Gravata'], ['gift', 'Presente'], ['horse-toy', 'Brinquedo'],
  ['tag', 'Etiqueta'], ['christmas-tree', 'Árvore de Natal'],
  ['building-factory-2', 'Fábrica'], ['leaf', 'Folha'],
]
export const THEME_OPTIONS: [value: 'dark' | 'cream', label: string][] = [['dark', 'Escuro'], ['cream', 'Claro']]
export const HERO_PATH = '/admin/collections/hero-slides'
