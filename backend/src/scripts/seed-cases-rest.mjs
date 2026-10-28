// Sobe os cases reais do cliente (doc "ok_cases de sucesso") via REST da backend
// LIVE, autenticando como admin. Serve quando nao da pra usar `railway run`
// (login expirado / projeto do cliente). Idempotente: pula quem ja existe por
// (cliente + titulo). Cases sao text-only (sem imagem, decisao 27/10).
//
// Fonte dos textos: doc "ok_cases de sucesso.docx" (Drive), condensado em 1 frase
// por case no mesmo estilo dos 6 ja publicados. Nada inventado.
//
// Uso (na pasta backend/):
//   node src/scripts/seed-cases-rest.mjs
// Flags: CASE_DRY=1 (so simula), CASE_BASE_URL (outra backend).

import { readFileSync } from 'fs'
import path from 'path'

const BASE = process.env.CASE_BASE_URL || 'https://heartfelt-courtesy-production-3747.up.railway.app'
const DRY = process.env.CASE_DRY === '1'

// Os 13 cases do doc que ainda nao estao no backend (os 6 primeiros ja subiram
// em 27/10). cliente, titulo, segmento, resumo. slug e auto-gerado do titulo.
const CASES = [
  { cliente: 'Sprite', titulo: 'Forma de gelo personalizada', segmento: 'Bebidas · Projeto especial', resumo: 'Forma de gelo em ABS com a identidade visual da Sprite, conectando o produto promocional ao momento de preparo e consumo das bebidas.' },
  { cliente: 'Batavo', titulo: 'Copo personalizado para campanha de iogurtes', segmento: 'Alimentos · Campanha nacional', resumo: 'Copos mini roma cristal personalizados para uma campanha nacional da linha de iogurtes Batavo, unindo utilidade e valor percebido ao contexto da ação.' },
  { cliente: 'Vono / Ajinomoto', titulo: 'Super Bowl colecionável', segmento: 'Alimentos · Coleção', resumo: 'Uma linha completa de Super Bowl colecionável desenvolvida ao longo de 4 anos para a Vono, marca da Ajinomoto, ligando a campanha a um utensílio de alimentação.' },
  { cliente: 'Todynho', titulo: 'Estojo porta-escova Green Fibras', segmento: 'Alimentos · Linha Green Fibras', resumo: 'Estojo porta-escova dental da Linha Green Fibras para um projeto da Todynho (Pepsico), unindo organização e fibras naturais incorporadas ao polipropileno.' },
  { cliente: 'Giraffas', titulo: 'Bolhão de sabão para campanha Compre e Ganhe', segmento: 'Food service · Compre e Ganhe', resumo: 'Bolhão de sabão para campanhas nacionais de Compre e Ganhe da rede Giraffas, somando uma atividade lúdica à ação promocional voltada ao público familiar.' },
  { cliente: 'Neodent', titulo: 'Estojo personalizado', segmento: 'Odontologia · Projeto especial', resumo: 'Estojos premium para aparelhos ortodônticos fornecidos ao longo de 4 anos à Neodent, em ABS com coinjeção de berço emborrachado interno personalizado.' },
  { cliente: 'Itaú', titulo: 'Brindes corporativos personalizados', segmento: 'Financeiro · Brindes corporativos', resumo: 'Espelho de bolsa, porta comprimidos, copos, chaveiros, mariner box e porta cartões fornecidos em diversas campanhas nacionais do Banco Itaú.' },
  { cliente: 'Lilica Ripilica', titulo: 'Canecas colecionáveis personalizadas', segmento: 'Varejo · Coleção', resumo: 'Canecas colecionáveis personalizadas com embalagens especiais para a Lilica Ripilica, unindo aplicação gráfica da marca e proposta colecionável.' },
  { cliente: 'Lojas Renner', titulo: 'Copos Cancun ecológicos Green Fibras', segmento: 'Varejo · Linha Green Fibras', resumo: 'Copos Cancun da Linha Green Fibras para as Lojas Renner, em fibras naturais e polipropileno, concebidos para uso permanente em substituição aos descartáveis.' },
  { cliente: 'Institutos Federais', titulo: 'Copos e canecas ecológicas para instituições de ensino', segmento: 'Educação · Linha Green Fibras', resumo: 'Copos e canecas da Linha Green Fibras para diversos Institutos Federais, apoiando a substituição de utensílios descartáveis no ambiente educacional.' },
  { cliente: 'PRIO', titulo: 'Chaveiro Polvo Green Plasticaria', segmento: 'Energia · Linha Green Plasticaria', resumo: 'Chaveiro Polvo da Linha Green Plasticaria para um projeto com a PRIO, feito com plástico reciclado equivalente ao consumo de 1 hora de um adulto no Brasil.' },
  { cliente: 'Heineken', titulo: 'Abridor Green Plasticaria', segmento: 'Bebidas · Linha Green Plasticaria', resumo: 'Abridor de garrafas personalizado para a Heineken na proposta da Linha Green Plasticaria, incorporando plástico reciclado a um acessório ligado ao universo da marca.' },
  { cliente: 'FBCA', titulo: 'Troféus e medalhas ecológicos personalizados', segmento: 'Esporte · Premiação', resumo: 'Troféus e medalhas do circuito da Federação Baiana de Corrida de Aventura (FBCA), fabricados 100% com plástico reciclado da Linha Green Plasticaria.' },
]

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
const pulados = []
const problemas = []
for (const c of CASES) {
  const q = `where[and][0][cliente][equals]=${encodeURIComponent(c.cliente)}&where[and][1][titulo][equals]=${encodeURIComponent(c.titulo)}&depth=0&limit=1`
  const er = await fetch(`${BASE}/api/cases?${q}`, { headers: AUTH })
  const existe = (await er.json()).docs?.[0]
  if (existe) {
    pulados.push(`${c.cliente} / ${c.titulo}`)
    continue
  }
  if (DRY) {
    console.log(`[DRY] cria: ${c.cliente} - ${c.titulo}`)
    done++
    continue
  }
  const cr = await fetch(`${BASE}/api/cases`, {
    method: 'POST',
    headers: { ...AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify(c),
  })
  if (!cr.ok) {
    problemas.push(`${c.cliente} / ${c.titulo} HTTP ${cr.status}: ${(await cr.text()).slice(0, 160)}`)
    continue
  }
  const novo = (await cr.json()).doc
  console.log(`OK: ${c.cliente} - ${c.titulo} (slug ${novo?.slug})`)
  done++
}

console.log(`${DRY ? '[DRY] ' : ''}FIM. criados: ${done} | pulados: ${pulados.length}`)
if (problemas.length) console.log('problemas: ' + problemas.join(' | '))
process.exit(0)
