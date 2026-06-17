import Link from "next/link";
import { categorias } from "@/data/categorias";

// Barra de categorias estilo iFood: icone + label, sem scroll horizontal.
// Quebra em ate 2 linhas no desktop e reduz colunas no mobile (S01-02).
const itens = [{ slug: "", nome: "Todos" }, ...categorias];

export default function CategoryMenu() {
  return (
    <nav className="border-t border-wf-line bg-wf-bg" aria-label="Categorias">
      <div className="wf-container grid grid-cols-3 gap-1 py-3 sm:grid-cols-4 md:grid-cols-6">
        {itens.map((c) => (
          <Link
            key={c.slug || "todos"}
            href={c.slug ? `/catalogo?categoria=${c.slug}` : "/catalogo"}
            className="flex flex-col items-center gap-1.5 rounded-lg p-2 text-center hover:bg-wf-surface"
          >
            <span className="wf-img h-12 w-12 rounded-full" aria-hidden="true" />
            <span className="text-xs font-medium leading-tight text-wf-ink">{c.nome}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
