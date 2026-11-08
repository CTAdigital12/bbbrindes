import { RequestError } from './api-errors'
export async function requestJSON<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, { credentials: 'same-origin', ...options })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new RequestError(response.status, result)
  return result as T
}
export async function uploadImage(file: File) {
  if (!file.type.startsWith('image/')) throw new Error('Escolha uma imagem.')
  if (file.size > 15 * 1024 * 1024) throw new Error('A imagem deve ter até 15 MB.')
  const body = new FormData()
  body.append('file', file)
  body.append('_payload', JSON.stringify({ alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') }))
  const { doc } = await requestJSON<{ doc: import('./model').Media }>('/api/media', { method: 'POST', body })
  return doc
}
// Troca o arquivo de uma imagem que ja existe. Mesma mecanica do upload de imagem
// nova (multipart file + _payload), so que PATCH no id em vez de POST. Mantem a
// descricao (alt) atual pra nao apagar o campo obrigatorio.
export async function replaceImage(id: number, file: File, alt?: string | null) {
  if (!file.type.startsWith('image/')) throw new Error('Escolha uma imagem.')
  if (file.size > 15 * 1024 * 1024) throw new Error('A imagem deve ter até 15 MB.')
  const body = new FormData()
  body.append('file', file)
  const keep = (alt ?? '').trim()
  if (keep) body.append('_payload', JSON.stringify({ alt: keep }))
  const { doc } = await requestJSON<{ doc: import('./model').Media }>(`/api/media/${id}`, { method: 'PATCH', body })
  return doc
}
