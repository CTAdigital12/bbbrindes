export async function requestJSON<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, { credentials: 'same-origin', ...options })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    const messages = result.errors?.map((error: { message?: string }) => error.message).filter(Boolean)
    throw new Error(messages?.join(' ') || result.message || 'Não foi possível concluir. Tente novamente.')
  }
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
