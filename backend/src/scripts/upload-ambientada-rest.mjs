// Sobe a imagemAmbientada (hover lifestyle) via REST da backend LIVE, que tem o
// R2 configurado. Serve quando nao da pra usar `railway run` (login expirado /
// projeto do cliente) e o .env local nao tem as creds do R2.
//
// Autentica como admin (collection `users`). As credenciais ficam no backend/.env
// (PAYLOAD_EMAIL, PAYLOAD_PASSWORD) OU nas env vars de mesmo nome; o script le,
// usa no login e NUNCA imprime o valor. Plano em AMB_PLAN [{cod,file}], arquivos
// em AMB_BASE.
//
// Uso (na pasta backend/):
//   AMB_PLAN="<abs>" AMB_BASE="<abs>" node src/scripts/upload-ambientada-rest.mjs
// Flags: AMB_OVERWRITE=1 (troca quem ja tem), AMB_BASE_URL (outra backend).

import { readFileSync } from 'fs'
import path from 'path'

const BASE = process.env.AMB_BASE_URL || 'https://heartfelt-courtesy-production-3747.up.railway.app'
const planPath = process.env.AMB_PLAN
const baseDir = process.env.AMB_BASE
const OVERWRITE = process.env.AMB_OVERWRITE === '1'

function loadCreds() {
  let email = process.env.PAYLOAD_EMAIL
  let pass = process.env.PAYLOAD_PASSWORD
  if (!email || !pass) {
    try {
      const txt = readFileSync(path.resolve('.env'), 'utf8')
      for (const line of txt.split(/\r?\n/)) {
        const m = line.match(/^(PAYLOAD_EMAIL|PAYLOAD_PASSWORD)=(.*)$/)
        if (m) {
          if (m[1] === 'PAYLOAD_EMAIL') email = email || m[2].trim()
          else pass = pass || m[2].trim()
        }
      }
    } catch {
      /* sem .env */
    }
  }
  return { email, pass }
}

const { email, pass } = loadCreds()
if (!email || !pass) {
  console.error('Faltou PAYLOAD_EMAIL / PAYLOAD_PASSWORD (em env ou backend/.env).')
  process.exit(1)
}
if (!planPath || !baseDir) {
  console.error('Faltou AMB_PLAN (json) e/ou AMB_BASE (dir dos arquivos).')
  process.exit(1)
}

const plan = JSON.parse(readFileSync(planPath, 'utf8'))

const lr = await fetch(`${BASE}/api/users/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password: pass }),
})
if (!lr.ok) {
  console.error(`login falhou HTTP ${lr.status} (confere email/senha do admin).`)
  process.exit(1)
}
const token = (await lr.json()).token
if (!token) {
  console.error('login sem token.')
  process.exit(1)
}
console.log('login OK')
const AUTH = { Authorization: `JWT ${token}` }

let done = 0
const problemas = []
for (const item of plan) {
  const pr = await fetch(
    `${BASE}/api/produtos?where[codigoSite][equals]=${encodeURIComponent(item.cod)}&depth=0&limit=1`,
    { headers: AUTH },
  )
  const prod = (await pr.json()).docs?.[0]
  if (!prod) {
    problemas.push(`${item.cod} (produto nao encontrado)`)
    continue
  }
  if (prod.imagemAmbientada && !OVERWRITE) {
    problemas.push(`${item.cod} (ja tem ambientada)`)
    continue
  }

  const buf = readFileSync(path.join(baseDir, item.file))
  const fd = new FormData()
  fd.append('file', new Blob([buf], { type: 'image/webp' }), item.file)
  fd.append('_payload', JSON.stringify({ alt: `${prod.nome ?? item.cod} - ambientada` }))
  const mr = await fetch(`${BASE}/api/media`, { method: 'POST', headers: AUTH, body: fd })
  if (!mr.ok) {
    problemas.push(`${item.cod} upload HTTP ${mr.status}: ${(await mr.text()).slice(0, 160)}`)
    continue
  }
  const mediaId = (await mr.json()).doc?.id
  const ur = await fetch(`${BASE}/api/produtos/${prod.id}`, {
    method: 'PATCH',
    headers: { ...AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({ imagemAmbientada: mediaId }),
  })
  if (!ur.ok) {
    problemas.push(`${item.cod} set-field HTTP ${ur.status}`)
    continue
  }
  console.log(`${item.cod} ambientada OK (media ${mediaId})`)
  done++
}

console.log(`FIM. ok: ${done}/${plan.length}`)
if (problemas.length) console.log('problemas: ' + problemas.join(' | '))
process.exit(0)
