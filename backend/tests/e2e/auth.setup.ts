import { test as setup, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

// Padrao oficial do Playwright "authenticate through API requests":
// faz o login via REST na API do Payload, deixa o contexto de request
// acumular o cookie HTTP-only da sessao e salva tudo num storageState.
// O projeto "smoke" reusa esse estado, entao o navegador ja abre logado
// e isolamos o render do dashboard do fluxo de login da SPA.
const authFile = path.join('playwright', '.auth', 'admin.json')

setup('autentica via API e salva o storageState', async ({ request }) => {
  const baseUrl = process.env.SMOKE_BASE_URL
  const email = process.env.SMOKE_ADMIN_EMAIL
  const password = process.env.SMOKE_ADMIN_PASSWORD

  if (!baseUrl || !email || !password) {
    throw new Error(
      'Faltam variaveis de ambiente. Defina SMOKE_BASE_URL, SMOKE_ADMIN_EMAIL e SMOKE_ADMIN_PASSWORD.',
    )
  }

  const res = await request.post(`${baseUrl.replace(/\/$/, '')}/api/users/login`, {
    data: { email, password },
  })

  expect(res.ok(), `login na API falhou (status ${res.status()})`).toBeTruthy()

  fs.mkdirSync(path.dirname(authFile), { recursive: true })
  await request.storageState({ path: authFile })
})
