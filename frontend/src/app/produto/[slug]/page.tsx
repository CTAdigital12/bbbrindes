import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { nomeCategoria } from "@/data/categorias";
import { produtoPorSlug, produtos } from "@/data/produtos";
import ProdutoCompra from "@/components/ProdutoCompra";
import ProductCard from "@/components/ProductCard";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return produtos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const produto = produtoPorSlug(slug);
  if (!produto) return { title: "Produto nao encontrado" };
  return { title: produto.nome, description: produto.descricao };
}

export default async function ProdutoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const produto = produtoPorSlug(slug);
  if (!produto) notFound();

  const relacionados = produtos
    .filter((p) => p.categoria === produto.categoria && p.slug !== produto.slug)
    .slice(0, 4);

  return (
    <div className="wf-container py-6">
      <nav className="mb-4 text-xs text-wf-muted">
        <Link href="/" className="hover:text-wf-accent">
          Inicio
        </Link>{" "}
        /{" "}
        <Link href={`/catalogo?categoria=${produto.categoria}`} className="hover:text-wf-accent">
          {nomeCategoria(produto.categoria)}
        </Link>{" "}
        / <span className="text-wf-text">{produto.nome}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Galeria */}
        <div className="space-y-3">
          <div className="wf-img aspect-square w-full rounded-lg">Imagem principal</div>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="wf-img aspect-square rounded">
                {i}
              </div>
            ))}
          </div>
        </div>

        {/* Informacoes e compra */}
        <div className="space-y-5">
          <div>
            <span className="text-xs text-wf-muted">{nomeCategoria(produto.categoria)}</span>
            <h1 className="text-2xl font-bold text-wf-ink">{produto.nome}</h1>
          </div>

          <p className="text-sm text-wf-text">{produto.descricao}</p>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-wf-muted">Material</dt>
              <dd className="font-medium text-wf-ink">{produto.material}</dd>
            </div>
            <div>
              <dt className="text-wf-muted">Personalizavel</dt>
              <dd className="font-medium text-wf-ink">{produto.personalizavel ? "Sim" : "Nao"}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-wf-muted">Aplicacoes</dt>
              <dd className="mt-1 flex flex-wrap gap-1">
                {produto.aplicacoes.map((a) => (
                  <span key={a} className="wf-chip">
                    {a}
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          <ProdutoCompra produto={produto} />
        </div>
      </div>

      {/* Relacionados */}
      {relacionados.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-3 text-lg font-semibold text-wf-ink">Produtos relacionados</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {relacionados.map((p) => (
              <ProductCard key={p.slug} produto={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
