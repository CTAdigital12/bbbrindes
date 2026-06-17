import Link from "next/link";
import type { Produto } from "@/lib/types";
import { nomeCategoria } from "@/data/categorias";
import { tagsDoProduto } from "@/data/produtos";

// Card de produto reutilizado na home e no catalogo. Sem preco na visao B2B publica.
export default function ProductCard({ produto }: { produto: Produto }) {
  const tags = tagsDoProduto(produto);
  return (
    <Link
      href={`/produto/${produto.slug}`}
      className="wf-card group flex flex-col overflow-hidden transition-shadow hover:shadow-md"
    >
      <div className="wf-img aspect-square w-full">Imagem</div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <span className="text-xs text-wf-muted">{nomeCategoria(produto.categoria)}</span>
        <h3 className="line-clamp-2 text-sm font-medium text-wf-ink group-hover:text-wf-accent">
          {produto.nome}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex gap-1" aria-label="Cores disponiveis">
            {produto.cores.slice(0, 5).map((c) => (
              <span
                key={c.nome}
                title={c.nome}
                className="h-4 w-4 rounded-full border border-wf-line"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          {tags.length > 0 && <span className="wf-tag">{tags[0]}</span>}
        </div>
      </div>
    </Link>
  );
}
