import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Carrega backend/.env (se existir) pro run LOCAL do smoke, onde ficam
// SMOKE_BASE_URL / SMOKE_ADMIN_EMAIL / SMOKE_ADMIN_PASSWORD. Tolerante: se o
// arquivo nao existir, dotenv.config so devolve um erro e NAO lanca, entao o
// run segue normal. No CI as vars vem via env: dos secrets (nao ha .env).
const configDir = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(configDir, '.env'), quiet: true })

// Configuracao do smoke E2E do admin do Payload.
// Roda contra uma URL externa (producao), por isso NAO tem webServer.
// A URL e as credenciais vem de variaveis de ambiente (nada hardcoded).
const CI = Boolean(process.env.CI)

export default defineConfig({
  testDir: './tests/e2e',
  // storageState gerado pelo projeto "setup" fica aqui (gitignored).
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,
  reporter: CI ? 'github' : 'list',
  use: {
    baseURL: process.env.SMOKE_BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'smoke',
      testMatch: /admin-smoke\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/admin.json',
      },
    },
  ],
})
