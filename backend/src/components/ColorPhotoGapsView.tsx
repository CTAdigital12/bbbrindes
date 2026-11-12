import React from 'react'
import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { redirect } from 'next/navigation'
import { readProducts } from '../admin/friendly/server-data'
import type { ProductColor } from '../admin/friendly/model'

// Painel "Produtos com cor sem foto" (item N da revisao do Plinio 10/11).
// Antes o botao "Resolver" do painel levava a UM produto so (o primeiro da fila).
// Aqui listamos TODOS os produtos que tem alguma cor sem a imagem dela, com link
// direto pra cada um. Rota registrada em payload.config.ts (admin.components.views):
// /admin/produtos-cor-sem-foto.
export default async function ColorPhotoGapsView(props: AdminViewServerProps) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')

  const products = await readProducts({ payload: req.payload, user: req.user })
  const rows = products
    .map((product) => {
      const cores = product.cores ?? []
      const semFoto = cores.filter((color) => !color.imagem)
      return { id: product.id, nome: product.nome, total: cores.length, semFoto }
    })
    .filter((row) => row.semFoto.length > 0)
    .sort((a, b) => b.semFoto.length - a.semFoto.length || a.nome.localeCompare(b.nome, 'pt-BR'))

  const totalCores = rows.reduce((sum, row) => sum + row.semFoto.length, 0)

  return <div className="bb-admin"><section className="bb-page">
    <div className="ph"><h1>Produtos com cor sem foto</h1><span className="sp" /><Link className="lnk" href="/admin">Voltar ao painel</Link></div>
    <p className="sub">
      {rows.length
        ? `${rows.length} ${rows.length === 1 ? 'produto tem' : 'produtos tem'} ${totalCores} ${totalCores === 1 ? 'cor' : 'cores'} sem a foto da cor. Abra cada um e suba a imagem da cor que falta.`
        : 'Nenhum produto com cor sem foto. Tudo certo por aqui.'}
    </p>

    {rows.length ? (
      <div className="bb-card"><div className="bd" style={{ padding: 0 }}>
        <div className="bb-table-scroll"><table className="list">
          <thead><tr><th>Produto</th><th>Cores sem foto</th><th style={{ width: 1 }}>Ação</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="t"><Link href={`/admin/collections/produtos/${row.id}`}>{row.nome}</Link></td>
                <td>
                  <span className="help" style={{ display: 'block', marginBottom: 4 }}>
                    {row.semFoto.length} de {row.total} {row.total === 1 ? 'cor' : 'cores'}
                  </span>
                  <ColorChips colors={row.semFoto} />
                </td>
                <td><Link className="btn sm ghost" href={`/admin/collections/produtos/${row.id}`}>Abrir produto</Link></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div></div>
    ) : null}
  </section></div>
}

function ColorChips({ colors }: { colors: ProductColor[] }) {
  return <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
    {colors.map((color, index) => (
      <span
        key={color.id ?? `${color.nome}-${index}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid #e5e7eb', borderRadius: 999, padding: '2px 10px', fontSize: 13 }}
      >
        <span aria-hidden style={{ width: 12, height: 12, borderRadius: '50%', border: '1px solid rgba(0,0,0,.15)', background: color.hex || '#f3f4f6' }} />
        {color.nome || 'Cor sem nome'}
      </span>
    ))}
  </span>
}
