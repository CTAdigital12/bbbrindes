// Poll de prontidao: espera a SMOKE_BASE_URL ficar de pe antes do smoke.
// Usado depois do `railway up` (deploy manual), porque o processo novo leva
// alguns segundos pra comecar a responder. Node puro (Node 20 tem fetch global),
// sem dependencias externas.
//
// Variaveis:
//   SMOKE_BASE_URL          (obrigatoria) base do admin em producao
//   SMOKE_WAIT_PATH         (opcional) caminho a consultar, padrao /admin
//   SMOKE_WAIT_TIMEOUT_MS   (opcional) timeout total, padrao 90000
//
// Considera "de pe" qualquer resposta HTTP com status < 500 (200, 3xx de
// redirect pro login, ou 401/403 ja provam que o servidor esta ouvindo).
// 5xx ou erro de rede contam como "ainda nao pronto".

const baseUrl = process.env.SMOKE_BASE_URL
const waitPath = process.env.SMOKE_WAIT_PATH ?? '/admin'
const timeoutMs = Number(process.env.SMOKE_WAIT_TIMEOUT_MS ?? 90_000)

if (!baseUrl) {
  console.error('wait-healthy: SMOKE_BASE_URL nao esta setada.')
  process.exit(1)
}

const target = `${baseUrl.replace(/\/$/, '')}${waitPath}`
const started = Date.now()
let attempt = 0
let delay = 2_000

async function probe() {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10_000)
  try {
    const res = await fetch(target, { redirect: 'manual', signal: controller.signal })
    return res.status < 500
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

while (Date.now() - started < timeoutMs) {
  attempt += 1
  if (await probe()) {
    console.log(`wait-healthy: ${target} respondeu na tentativa ${attempt} (${Date.now() - started}ms).`)
    process.exit(0)
  }
  console.log(`wait-healthy: tentativa ${attempt} sem resposta util, aguardando ${delay}ms...`)
  await new Promise((resolve) => setTimeout(resolve, delay))
  delay = Math.min(Math.round(delay * 1.5), 10_000)
}

console.error(`wait-healthy: ${target} nao ficou pronto em ${timeoutMs}ms.`)
process.exit(1)
