import type { Field, FieldHook } from 'payload'

// Slugify sem dependencia externa: remove acentos, baixa a caixa e troca o que
// nao for [a-z0-9] por hifen. Mesma regra de slug ja usada no front.
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const formatSlug =
  (from: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    const fallback = data?.[from]
    return typeof fallback === 'string' ? slugify(fallback) : value
  }

// Campo slug reaproveitavel: gera a partir de `from` (padrao "nome") quando vazio.
export const slugField = (from = 'nome'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'URL amigavel em kebab-case. Gerado a partir do nome se ficar vazio.',
  },
  hooks: {
    beforeValidate: [formatSlug(from)],
  },
})
