import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { campanhaPorSlug, campanhas } from "@/data/campanhas";
import { produtos } from "@/data/produtos";
import ProductCard from "@/components/ProductCard";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return campanhas.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const c = campanhaPorSlug(slug);
  if (!c) return { title: "Campanha" };
  return {
    title: `Campanha ${c.nome}`,
    description: `Brindes corporativos para a campanha ${c.nome} (${c.mes}).`,
  };
}

// Landing page de campanha (destino para anuncios/LPs). Stub no wireframe.
export default async function CampanhaPage({ params }: { params: Params }) {
  const { slug } = await params;
  const c = campanhaPorSlug(slug);
  if (!c) notFound();

  const itens = produtos.slice(0, 8);

  return (
    <div>
      <section className="wf-img flex min-h-[220px] items-end">
        <div className="wf-container py-6">
          <div className="max-w-xl rounded bg-wf-surface/85 p-5">
            <span className="wf-tag">Campanha {c.mes}</span>
            <h1 className="mt-1 text-3xl font-bold text-wf-ink">{c.nome}</h1>
            <p className="mt-1 text-sm text-wf-text">
              Brindes selecionados para a campanha de {c.nome}. Monte seu orcamento.
            </p>
            <Link href="/catalogo" className="wf-btn-primary mt-3">
              Ver catalogo completo
            </Link>
          </div>
        </div>
      </section>

      <section className="wf-container py-8">
        <h2 className="mb-3 text-lg font-semibold text-wf-ink">Sugestoes para {c.nome}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {itens.map((p) => (
            <ProductCard key={p.slug} produto={p} />
          ))}
        </div>
        <p className="mt-4 text-xs text-wf-muted">
          Pagina de campanha (wireframe). Conteudo e produtos da campanha virao do CMS.
        </p>
      </section>
    </div>
  );
}
