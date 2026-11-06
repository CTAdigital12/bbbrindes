import type { NavItem } from './AdminChrome'
export const NAV_ITEMS: NavItem[] = [
  { group: '', label: 'Painel', href: '/admin', icon: 'painel' },
  { group: 'Site', label: 'Página inicial', href: '/admin/globals/conteudo-home', icon: 'home' },
  { group: 'Site', label: 'Banners', href: '/admin/collections/hero-slides', icon: 'banner' },
  { group: 'Catálogo', label: 'Produtos', href: '/admin/collections/produtos', icon: 'prod' },
  { group: 'Catálogo', label: 'Categorias', href: '/admin/collections/categorias', icon: 'cat' },
  { group: 'Marketing', label: 'Campanhas', href: '/admin/collections/campanhas', icon: 'camp' },
  { group: 'Marketing', label: 'Orçamentos', href: '/admin/collections/logs-entrega', icon: 'orc' },
  { group: 'Conteúdo', label: 'Cases', href: '/admin/collections/cases', icon: 'cases' },
  { group: 'Conteúdo', label: 'Blog', href: '/admin/collections/posts', icon: 'blog' },
  { group: 'Conteúdo', label: 'Imprensa', href: '/admin/collections/imprensa', icon: 'imp' },
  { group: 'Biblioteca', label: 'Mídia', href: '/admin/collections/media', icon: 'midia' },
  { group: 'Sistema', label: 'Configurações', href: '/admin/globals/configuracoes', icon: 'cfg' },
  { group: 'Sistema', label: 'Usuários', href: '/admin/collections/users', icon: 'users' },
]
export const MORE_ITEMS: NavItem[] = [
  { group: '', label: 'Depoimentos', href: '/admin/collections/depoimentos', icon: 'blog' },
  { group: '', label: 'Logos', href: '/admin/collections/logos', icon: 'midia' },
  { group: '', label: 'Institucional', href: '/admin/globals/conteudo-institucional', icon: 'home' },
  { group: '', label: 'Catálogo digital', href: '/admin/globals/catalogos', icon: 'cat' },
  { group: '', label: 'Tags', href: '/admin/collections/tags', icon: 'cat' },
  { group: '', label: 'Revendedores', href: '/admin/collections/revendedores', icon: 'users' },
]
