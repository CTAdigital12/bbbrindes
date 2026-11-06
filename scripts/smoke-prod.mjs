// Smoke test do backend em producao (ou qualquer URL via BASE).
// Bate nos endpoints criticos e FALHA (exit 1) se algum nao responder 200.
// Objetivo: pegar na hora um deploy que subiu quebrado (ex.: boot 502,
// "Missing script", collection faltando) antes de confiar que esta no ar.
//
// Uso:
//   node scripts/smoke-prod.mjs
//   BASE="https://heartfelt-courtesy-production-3747.up.railway.app" node scripts/smoke-prod.mjs
//   REQUIRE_DEPOIMENTOS=1 node scripts/smoke-prod.mjs   (exige o #107 no ar)
//
// Serve pra rodar logo apos cada deploy e tambem no CI (step pos-deploy).

const BASE = (process.env.BASE || 'https://heartfelt-courtesy-production-3747.up.railway.app').replace(/\/+$/, '')
const TIMEOUT = Number(process.env.TIMEOUT_MS || 15000)

// [path, precisa totalDocs>0?]
const checks = [
  ['/api/produtos?limit=1', true],
  ['/api/categorias?limit=1', true],
  ['/api/globals/configuracoes', false],
  ['/api/globals/conteudo-institucional', false],
]
if (process.env.REQUIRE_DEPOIMENTOS === '1') checks.push(['/api/depoimentos?limit=1', false])

async function hit(path) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), TIMEOUT)
  try {
    const res = await fetch(BASE + path, { signal: ctrl.signal, headers: { 'user-agent': 'bbbrindes-smoke' } })
    let total
    try {
      const j = await res.json()
      total = j && typeof j.totalDocs === 'number' ? j.totalDocs : undefined
    } catch {
      /* resposta nao-json (ex. 502 html) */
    }
    return { status: res.status, total }
  } catch (e) {
    return { status: 0, erro: e.name === 'AbortError' ? `timeout ${TIMEOUT}ms` : e.message }
  } finally {
    clearTimeout(t)
  }
}

let falhas = 0
console.log(`Smoke test: ${BASE}`)
for (const [path, exigeDocs] of checks) {
  const r = await hit(path)
  const okStatus = r.status === 200
  const okDocs = !exigeDocs || (typeof r.total === 'number' && r.total > 0)
  const ok = okStatus && okDocs
  if (!ok) falhas++
  const extra = r.erro ? ` (${r.erro})` : r.total !== undefined ? ` total=${r.total}` : ''
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${r.status}  ${path}${extra}`)
}

if (falhas) {
  console.error(`\nSMOKE FAIL: ${falhas} endpoint(s) com problema.`)
  process.exit(1)
}
console.log('\nSMOKE OK: backend saudavel.')
process.exit(0)
