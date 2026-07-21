import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { nomeCategoria } from "@/data/categorias";
import { produtoPorSlug, produtos } from "@/data/produtos";
import ProdutoView from "@/components/ProdutoView";
import ProdutoDetalheView from "@/components/ProdutoDetalheView";
import ProductCard from "@/components/ProductCard";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return produtos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const produto = produtoPorSlug(slug);
  if (!produto) return { title: "Produto nao encontrado" };
  // Produto-modelo (S03-11) usa os metadados da Versao A de docs/pdp-modelo-squeeze.md.
  if (produto.slug === "squeeze-300ml-personalizado") {
    return {
      title: "Squeeze 300 mL Personalizado | Brinde Corporativo | BB Brindes",
      description:
        "Squeeze 300 mL personalizado, atoxico e livre de BPA. Brinde corporativo para SIPAT, eventos e campanhas. Fabrica propria, producao nacional.",
    };
  }
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

      <ProdutoView produto={produto} />

      {produto.detalhe && <ProdutoDetalheView detalhe={produto.detalhe} />}

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
