import type { Payload } from 'payload'

import Link from 'next/link'
import React from 'react'

/**
 * Bloco de boas-vindas no topo do Dashboard (admin.components.beforeDashboard).
 * Server Component: recebe o `payload` (Local API) pra contar produtos sem foto.
 * Estilo em app/(payload)/custom.scss (classe .bb-welcome).
 *
 * Saudacao em horario de Brasilia (o servidor roda em UTC).
 */

type Props = {
  payload?: Payload
  user?: { email?: string } | null
}

const ATALHOS: { href: string; titulo: string; sub: string }[] = [
  {
    href: '/admin/collections/produtos/create',
    titulo: 'Adicionar produto',
    sub: 'Cadastrar um novo item no catalogo',
  },
  {
    href: '/admin/globals/conteudo-home',
    titulo: 'Editar a pagina inicial',
    sub: 'Textos e destaques da home',
  },
  {
    href: '/admin/collections/media',
    titulo: 'Biblioteca de midia',
    sub: 'Subir e organizar imagens',
  },
  {
    href: '/admin/collections/campanhas',
    titulo: 'Campanhas',
    sub: 'Datas e ofertas do mes',
  },
]

function saudacao(): string {
  const horaBRT = (new Date().getUTCHours() - 3 + 24) % 24
  if (horaBRT < 12) return 'Bom dia'
  if (horaBRT < 18) return 'Boa tarde'
  return 'Boa noite'
}

/** Primeiro nome a partir do e-mail: "fabio.ferreira@..." -> "Fabio". */
function primeiroNome(email?: string): string {
  if (!email) return ''
  const local = email.split('@')[0] ?? ''
  const token = (local.split(/[._-]/)[0] || local).trim()
  if (!token) return ''
  return token.charAt(0).toUpperCase() + token.slice(1)
}

export default async function WelcomeDashboard(props: Props) {
  const { payload, user } = props
  const nome = primeiroNome(user?.email)

  let semFoto = 0
  try {
    if (payload) {
      const res = await payload.count({
        collection: 'produtos',
        where: { imagens: { exists: false } },
      })
      semFoto = res.totalDocs
    }
  } catch {
    // o alerta nunca pode derrubar o dashboard
    semFoto = 0
  }

  return (
    <div className="bb-welcome">
      <h2 className="bb-welcome__hi">
        {saudacao()}
        {nome ? `, ${nome}` : ''} 👋
      </h2>
      <p className="bb-welcome__sub">O que voce quer editar hoje?</p>

      {semFoto > 0 ? (
        <Link
          className="bb-welcome__alert"
          href="/admin/collections/produtos?where[imagens][exists]=false"
        >
          <span className="bb-welcome__alert-dot">{semFoto}</span>
          <span>
            {semFoto === 1 ? 'produto sem foto' : 'produtos sem foto'}. Clique para revisar o
            catalogo.
          </span>
        </Link>
      ) : null}

      <div className="bb-welcome__cards">
        {ATALHOS.map((a) => (
          <Link key={a.href} className="bb-welcome__card" href={a.href}>
            <b>{a.titulo}</b>
            <span>{a.sub}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
