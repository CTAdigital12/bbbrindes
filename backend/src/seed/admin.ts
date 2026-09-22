// Seed de admin: cria o usuario admin (colecao users) se nao existir, ou reseta a
// senha se o email ja existir. Idempotente. Usa o Local API (sem precisar de login).
//
// O email e a senha vem de variaveis de ambiente, NAO ficam no codigo:
//   PowerShell (na pasta backend/):
//     $env:ADMIN_EMAIL="voce@raizhe.com"; $env:ADMIN_PASSWORD="SuaSenhaForte"; node_modules/.bin/payload run src/seed/admin.ts
//   Bash:
//     ADMIN_EMAIL="voce@raizhe.com" ADMIN_PASSWORD="SuaSenhaForte" node_modules/.bin/payload run src/seed/admin.ts
//
// O `payload run` carrega o backend/.env (PG*, PAYLOAD_SECRET) e conecta no mesmo
// Supabase que o Railway usa, entao o admin criado/resetado vale nos dois.

import { getPayload } from 'payload'
import config from '@payload-config'

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.ADMIN_PASSWORD

if (!email || !password) {
  console.error(
    'Faltam variaveis. Defina ADMIN_EMAIL e ADMIN_PASSWORD antes de rodar. Ex.:\n' +
      '  $env:ADMIN_EMAIL="voce@raizhe.com"; $env:ADMIN_PASSWORD="SuaSenhaForte"; node_modules/.bin/payload run src/seed/admin.ts',
  )
  process.exit(1)
}

try {
  const payload = await getPayload({ config })

  const existente = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
  })

  if (existente.docs.length > 0) {
    await payload.update({
      collection: 'users',
      id: existente.docs[0].id,
      data: { password },
    })
    console.log(`Senha atualizada para o admin existente: ${email}`)
  } else {
    await payload.create({
      collection: 'users',
      data: { email, password },
    })
    console.log(`Admin criado: ${email}`)
  }

  process.exit(0)
} catch (e) {
  console.error('Falhou ao criar/resetar o admin:', e)
  process.exit(1)
}
