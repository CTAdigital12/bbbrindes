import Link from "next/link";
import { banners, diferenciais, linhasVisuais } from "@/data/banners";
import { categorias } from "@/data/categorias";
import { posts } from "@/data/blog";
import { produtos, produtosPorDestaque } from "@/data/produtos";
import ProductRow from "@/components/ProductRow";

export default function HomePage() {
  const [hero, ...miniBanners] = banners;

  return (
    <div>
      {/* Banners de campanha */}
      <section className="wf-container grid gap-3 py-6 lg:grid-cols-3">
        <Link
          href={hero.href}
          className="wf-img relative col-span-1 flex min-h-[220px] flex-col justify-end overflow-hidden rounded-lg p-6 lg:col-span-2"
        >
          <div className="relative max-w-md rounded bg-wf-surface/85 p-4">
            <span className="wf-tag">Campanha</span>
            <h1 className="mt-1 text-2xl font-bold text-wf-ink">{hero.titulo}</h1>
            <p className="mt-1 text-sm text-wf-text">{hero.subtitulo}</p>
            <span className="wf-btn-primary mt-3">{hero.cta}</span>
          </div>
        </Link>

        <div className="grid gap-3">
          {miniBanners.map((b) => (
            <Link
              key={b.id}
              href={b.href}
              className="wf-img flex min-h-[100px] flex-col justify-end rounded-lg p-4"
            >
              <div className="rounded bg-wf-surface/85 p-3">
                <h2 className="text-sm font-semibold text-wf-ink">{b.titulo}</h2>
                <p className="text-xs text-wf-text">{b.cta}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categorias visuais */}
      <section className="wf-container py-6">
        <h2 className="mb-3 text-lg font-semibold text-wf-ink">Categorias</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categorias.map((c) => (
            <Link
              key={c.slug}
              href={`/catalogo?categoria=${c.slug}`}
              className="wf-card flex flex-col items-center gap-2 p-3 text-center hover:shadow-md"
            >
              <span className="wf-img h-16 w-16 rounded-full" />
              <span className="text-xs font-medium text-wf-ink">{c.nome}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Secoes de produtos */}
      <ProductRow titulo="Em destaque" produtos={produtosPorDestaque("destaque")} />
      <ProductRow titulo="Mais vendidos" produtos={produtosPorDestaque("mais-vendido")} />
      <ProductRow titulo="Lancamentos" produtos={produtosPorDestaque("lancamento")} />

      {/* Linhas visuais */}
      <section className="wf-container py-6">
        <h2 className="mb-3 text-lg font-semibold text-wf-ink">Linhas de produto</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {linhasVisuais.map((l) => (
            <Link
              key={l.nome}
              href={l.href}
              className="wf-img flex min-h-[90px] items-end rounded-lg p-2"
            >
              <span className="rounded bg-wf-surface/85 px-2 py-1 text-xs font-medium text-wf-ink">
                {l.nome}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Diferenciais */}
      <section className="border-y border-wf-line bg-wf-surface">
        <div className="wf-container grid grid-cols-2 gap-3 py-8 sm:grid-cols-3 lg:grid-cols-3">
          {diferenciais.map((d) => (
            <div key={d} className="flex items-center gap-3">
              <span className="wf-img h-9 w-9 rounded-full" />
              <span className="text-sm font-medium text-wf-ink">{d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Teaser de blog */}
      <section className="wf-container py-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-wf-ink">Do blog</h2>
          <Link href="/blog" className="text-sm text-wf-accent hover:underline">
            Ver blog
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="wf-card overflow-hidden hover:shadow-md">
              <div className="wf-img aspect-[16/9] w-full">Imagem</div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-wf-ink">{p.titulo}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-wf-text">{p.resumo}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Faixa de revenda */}
      <section className="wf-container pb-10">
        <div className="wf-card flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-wf-ink">E revendedor?</h2>
            <p className="text-sm text-wf-text">
              Acesse precos tabelados, estoque e fechamento de pedido na area exclusiva.
            </p>
          </div>
          <Link href="/revendedor/login" className="wf-btn-primary">
            Acessar area do revendedor
          </Link>
        </div>
        <p className="mt-4 text-center text-xs text-wf-muted">
          Catalogo de exemplo com {produtos.length} produtos. Na producao: ~1200 SKUs.
        </p>
      </section>
    </div>
  );
}
