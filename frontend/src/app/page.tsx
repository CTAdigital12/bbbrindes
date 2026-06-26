import Link from "next/link";
import { banners, diferenciais, miniBanners } from "@/data/banners";
import { campanhas } from "@/data/campanhas";
import { categorias } from "@/data/categorias";
import { posts } from "@/data/blog";
import { produtos, produtosEcologicos } from "@/data/produtos";
import { cases } from "@/data/cases";
import { materias } from "@/data/imprensa";
import BannerCarousel from "@/components/BannerCarousel";
import DestaquesRandom from "@/components/DestaquesRandom";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  return (
    <div>
      <h1 className="sr-only">bbbrindes - brindes corporativos personalizados</h1>

      {/* Banners: carrossel rotativo + secundarios */}
      <section className="wf-container grid gap-3 py-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BannerCarousel banners={banners} />
        </div>
        <div className="grid gap-3">
          {miniBanners.map((b) => (
            <Link
              key={b.id}
              href={b.href}
              className="wf-img flex min-h-[110px] flex-col justify-end rounded-lg p-4"
            >
              <div className="rounded bg-wf-surface/85 p-3">
                <h2 className="text-sm font-semibold text-wf-ink">{b.titulo}</h2>
                <p className="text-xs text-wf-text">{b.subtitulo}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categorias estilo iFood: faixa unica na Home, sem moldura (S01-02) */}
      <section className="wf-container py-6">
        <h2 className="mb-3 text-lg font-semibold text-wf-ink">Categorias</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {categorias.map((c) => (
            <Link
              key={c.slug}
              href={`/catalogo?categoria=${c.slug}`}
              className="flex flex-col items-center gap-2 rounded-lg p-2 text-center hover:bg-wf-surface"
            >
              <span className="wf-img h-16 w-16 rounded-full" aria-hidden="true" />
              <span className="text-xs font-medium leading-tight text-wf-ink">{c.nome}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Lancamentos: 1 linha randomica de 6 produtos + ver todos */}
      <DestaquesRandom produtos={produtos} />

      {/* Campanhas e datas comemorativas (substitui "Linhas de produto").
          Limita a um numero par para nao sobrar tile na grade de 6 colunas. */}
      <section className="wf-container py-6">
        <h2 className="mb-3 text-lg font-semibold text-wf-ink">Campanhas e datas</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {campanhas.slice(0, campanhas.length - (campanhas.length % 2)).map((c) => (
            <Link
              key={c.slug}
              href={`/campanha/${c.slug}`}
              className="wf-img flex min-h-[90px] items-end rounded-lg p-2"
            >
              <span className="rounded bg-wf-surface/85 px-2 py-1 text-xs font-medium text-wf-ink">
                {c.nome}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Brindes Ecologicos: sessao tipo Lancamentos, 5 produtos, sem cores no card (revisao Plinio 2) */}
      <section className="wf-container py-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-wf-ink">Brindes Ecologicos</h2>
          <Link href="/catalogo?categoria=green-plasticaria" className="text-sm text-wf-accent hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {produtosEcologicos()
            .slice(0, 6)
            .map((p, i) => (
              <ProductCard
                key={p.slug}
                produto={p}
                compacto
                ocultarCores
                className={i === 5 ? "lg:hidden" : ""}
              />
            ))}
        </div>
      </section>

      {/* Diferenciais (cada um vira link) */}
      <section className="border-y border-wf-line bg-wf-surface">
        <div className="wf-container grid grid-cols-2 gap-3 py-8 sm:grid-cols-3">
          {diferenciais.map((d) => (
            <Link key={d.nome} href={d.href} className="group flex items-center gap-3">
              <span className="wf-img h-9 w-9 rounded-full" />
              <span className="text-sm font-medium text-wf-ink group-hover:text-wf-accent">
                {d.nome}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cases / prova social (S01-08) */}
      <section className="wf-container py-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-wf-ink">Cases e prova social</h2>
          <Link href="/cases" className="text-sm text-wf-accent hover:underline">
            Ver cases
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {cases.slice(0, 3).map((c) => (
            <Link key={c.slug} href="/cases" className="wf-card overflow-hidden hover:shadow-md">
              <div className="wf-img flex aspect-[16/9] w-full items-center justify-center text-sm font-semibold text-wf-ink">
                {c.cliente}
              </div>
              <div className="p-3">
                <p className="text-xs uppercase tracking-wide text-wf-muted">{c.segmento}</p>
                <h3 className="text-sm font-medium text-wf-ink">{c.titulo}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Na imprensa (S01-09) */}
      <section className="border-y border-wf-line bg-wf-surface">
        <div className="wf-container py-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-wf-ink">Na imprensa</h2>
            <Link href="/imprensa" className="text-sm text-wf-accent hover:underline">
              Ver imprensa
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {materias.slice(0, 3).map((m) => (
              <li key={m.id}>
                <Link href="/imprensa" className="block">
                  <p className="text-xs font-semibold uppercase tracking-wide text-wf-muted">
                    {m.veiculo}
                  </p>
                  <p className="text-sm font-medium text-wf-ink hover:text-wf-accent">{m.titulo}</p>
                </Link>
              </li>
            ))}
          </ul>
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
    </div>
  );
}
