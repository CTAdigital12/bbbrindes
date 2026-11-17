import { test, expect } from '@playwright/test'

// Smoke do admin: garante que a tela custom do Payload RENDERIZA de verdade
// quando autenticado, em vez de ficar branca (o bug do importMap sem o handler
// do S3 quebra justamente a montagem dos componentes custom).
//
// Ancoras de render estaveis (ver backend/src/admin/friendly/Dashboard.tsx):
//   - heading "Painel"
//   - o texto fixo "O que você quer fazer hoje?"
// Essas ancoras so aparecem quando os componentes custom montam, entao servem
// de sinal de "nao esta branco".
test('o admin autenticado renderiza o painel (nao fica em branco)', async ({ page }) => {
  const pageErrors: string[] = []
  const serverErrors: string[] = []

  // pageerror e resposta 5xx REPROVAM o teste.
  page.on('pageerror', (err) => {
    pageErrors.push(err.message)
  })
  page.on('response', (res) => {
    if (res.status() >= 500) {
      serverErrors.push(`${res.status()} ${res.url()}`)
    }
  })

  // console.error e requestfailed sao apenas LOG (nao reprovam): sites reais
  // costumam ter ruido de terceiros que nao significa tela branca.
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`[console.error] ${msg.text()}`)
    }
  })
  page.on('requestfailed', (req) => {
    console.log(`[requestfailed] ${req.method()} ${req.url()} ${req.failure()?.errorText ?? ''}`)
  })

  await page.goto('/admin')

  await expect(page.getByRole('heading', { name: 'Painel' })).toBeVisible({ timeout: 15000 })
  await expect(page.getByText('O que você quer fazer hoje?')).toBeVisible()

  expect(serverErrors, `respostas 5xx durante o carregamento:\n${serverErrors.join('\n')}`).toEqual([])
  expect(pageErrors, `erros de JS na pagina:\n${pageErrors.join('\n')}`).toEqual([])
})
