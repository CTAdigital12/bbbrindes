import Link from "next/link";
import type { Produto } from "@/lib/types";

// Card de produto reutilizado na home e no catalogo. Sem preco na visao B2B publica.
// Sem tag nem categoria no card (revisao Plinio): so imagem, nome e (fora da home) cores.
// compacto: imagem mais baixa (4/3), usada nas faixas da home.
// ocultarCores: esconde as bolinhas de cor (na home as cores ficam so na PDP).
export default function ProductCard({
  produto,
  compacto = false,
  ocultarCores = false,
  className = "",
}: {
  produto: Produto;
  compacto?: boolean;
  ocultarCores?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/produto/${produto.slug}`}
      className={`wf-card group flex flex-col overflow-hidden transition-shadow hover:shadow-md ${className}`}
    >
      <div className={`wf-img w-full ${compacto ? "aspect-[4/3]" : "aspect-square"}`}>Imagem</div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-wf-ink group-hover:text-wf-accent">
          {produto.nome}
        </h3>

        {!ocultarCores && (
          <div className="mt-auto flex gap-1 pt-2" aria-label="Cores disponiveis">
            {produto.cores.slice(0, 5).map((c) => (
              <span
                key={c.nome}
                title={c.nome}
                className="h-4 w-4 rounded-full border border-wf-line"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
