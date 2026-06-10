import Link from "next/link";
import type { Produto } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

// Secao horizontal de produtos com titulo e link "ver todos".
export default function ProductRow({
  titulo,
  produtos,
  href = "/catalogo",
}: {
  titulo: string;
  produtos: Produto[];
  href?: string;
}) {
  if (produtos.length === 0) return null;
  return (
    <section className="wf-container py-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-wf-ink">{titulo}</h2>
        <Link href={href} className="text-sm text-wf-accent hover:underline">
          Ver todos
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {produtos.map((p) => (
          <ProductCard key={p.slug} produto={p} />
        ))}
      </div>
    </section>
  );
}
