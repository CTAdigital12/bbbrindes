import { afterEach, describe, expect, it, vi } from 'vitest'
import { requestJSON, uploadImage } from '../../src/admin/friendly/api'
afterEach(() => { vi.unstubAllGlobals() })
describe('contrato de gravacao', () => {
 it('envia a sessao e nao trata erro HTTP como sucesso', async () => {
  const fetch = vi.fn(async () => new Response(JSON.stringify({ errors: [{ message: 'Codigo duplicado' }] }), { status: 400 }))
  vi.stubGlobal('fetch', fetch)
  await expect(requestJSON('/api/produtos/1', { method: 'PATCH' })).rejects.toThrow('Codigo duplicado')
  expect(fetch).toHaveBeenCalledWith('/api/produtos/1', expect.objectContaining({ credentials: 'same-origin', method: 'PATCH' }))
 })
 it('rejeita arquivos fora do contrato antes de enviar', async () => {
  const fetch = vi.fn(); vi.stubGlobal('fetch', fetch)
  await expect(uploadImage(new File(['texto'], 'arquivo.pdf', { type: 'application/pdf' }))).rejects.toThrow('imagem')
  await expect(uploadImage(new File([new Uint8Array(15*1024*1024+1)], 'grande.png', { type: 'image/png' }))).rejects.toThrow('15 MB')
  expect(fetch).not.toHaveBeenCalled()
 })
})


describe('erros de validacao retornados pelo servidor', () => {
 it('preserva caminhos estruturados do Payload para orientar o formulario', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ errors: [{ message: 'The following field is invalid', data: { errors: [{ path: 'cores.0.nome', message: 'This field is required.' }] } }] }), { status: 400 })))
  await expect(requestJSON('/api/produtos')).rejects.toMatchObject({ status: 400, fields: [{ path: 'cores.0.nome', message: 'This field is required.' }] })
 })
 it('suporta corpo de erro incompleto sem substituir pela falha do parser', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ errors: [null, { message: 'Falha segura', data: { errors: null } }] }), { status: 400 })))
  await expect(requestJSON('/api/produtos')).rejects.toThrow('Falha segura')
 })
})
