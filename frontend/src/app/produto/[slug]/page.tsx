import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { nomeCategoria } from "@/data/categorias";
import { getProdutoBySlug, getProdutoSlugs, getProdutos } from "@/lib/produtos";
import ProdutoView from "@/components/ProdutoView";
import ProdutoDetalheView from "@/components/ProdutoDetalheView";
import VistosRecentemente from "@/components/VistosRecentemente";
import Rail from "@/components/Rail";
import ProductCardJoy from "@/components/ProductCardJoy";
import { pageUrl } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  // Uma PDP por produto REAL do backend (fallback pros slugs do mock se o backend
  // cair no build). Antes isto lia `produtos` (mock), entao os 150+ produtos reais
  // nunca ganhavam pagina e davam 404 pro cliente.
  const slugs = await getProdutoSlugs();
  return slugs.map((slug) => ({ slug }));
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

  // Relacionados por categoria, a partir do catalogo REAL (getProdutos; cai no
  // mock se o backend estiver fora no build), como o `rel` do produto() do mockup.
  const todos = await getProdutos();
  const relacionados = todos
    .filter((p) => p.categoria === produto.categoria && p.slug !== produto.slug)
    .slice(0, 8);

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
    <div className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="crumb">
        <Link href="/">Início</Link>/
        <Link href={`/catalogo?categoria=${produto.categoria}`}>
          {nomeCategoria(produto.categoria)}
        </Link>
        /<span>{produto.nome}</span>
      </div>

      <ProdutoView produto={produto} />

      <ProdutoDetalheView produto={produto} />

      {relacionados.length > 0 && (
        <section className="sec">
          <div className="shead">
            <h2 style={{ fontSize: 24 }}>Quem viu este produto também pediu</h2>
          </div>
          <Rail id="tr-rel">
            {relacionados.map((p) => (
              <ProductCardJoy key={p.slug} produto={p} />
            ))}
          </Rail>
        </section>
      )}

      <VistosRecentemente produto={produto} />
    </div>
  );
}
