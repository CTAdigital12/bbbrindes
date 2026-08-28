import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { nomeCategoria } from "@/data/categorias";
import { produtos } from "@/data/produtos";
import { getProdutoBySlug } from "@/lib/produtos";
import ProdutoView from "@/components/ProdutoView";
import ProdutoDetalheView from "@/components/ProdutoDetalheView";
import ProductCard from "@/components/ProductCard";
import { pageUrl } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return produtos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const produto = await getProdutoBySlug(slug);
  if (!produto) return { title: "Produto nao encontrado" };

  // Produto-modelo (S03-11) usa os metadados da Versao A de docs/pdp-modelo-squeeze.md.
  const isModelo = produto.slug === "squeeze-300ml-personalizado";
  const tituloModelo = "Squeeze 300 mL Personalizado | Brinde Corporativo | BB Brindes";
  const description = isModelo
    ? "Squeeze 300 mL personalizado, atoxico e livre de BPA. Brinde corporativo para SIPAT, eventos e campanhas. Fabrica propria, producao nacional."
    : produto.descricao;
  const url = pageUrl(`/produto/${produto.slug}`);
  // title absoluto no modelo (ja traz "| BB Brindes"); nos demais o template do
  // layout acrescenta o sufixo.
  const title: Metadata["title"] = isModelo ? { absolute: tituloModelo } : produto.nome;
  const ogTitle = isModelo ? tituloModelo : `${produto.nome} | BB Brindes`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: ogTitle, description, url },
  };
}

export default async function ProdutoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const produto = await getProdutoBySlug(slug);
  if (!produto) notFound();

  const relacionados = produtos
    .filter((p) => p.categoria === produto.categoria && p.slug !== produto.slug)
    .slice(0, 4);

  // Dados estruturados da PDP: Produto e trilha de navegacao (Breadcrumb).
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produto.nome,
    description: produto.detalhe?.linhaCurta ?? produto.descricao,
    category: nomeCategoria(produto.categoria),
    brand: { "@type": "Brand", name: "BB Brindes" },
    url: pageUrl(`/produto/${produto.slug}`),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: pageUrl("/") },
      { "@type": "ListItem", position: 2, name: nomeCategoria(produto.categoria), item: pageUrl("/catalogo") },
      { "@type": "ListItem", position: 3, name: produto.nome, item: pageUrl(`/produto/${produto.slug}`) },
    ],
  };

  return (
    <div className="wf-container py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
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
