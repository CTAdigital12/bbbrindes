import Link from "next/link";
import { categorias } from "@/data/categorias";

// Menu superior visual de categorias (espelha o site atual).
export default function CategoryMenu() {
  return (
    <nav className="border-t border-wf-line bg-wf-bg" aria-label="Categorias">
      <div className="wf-container flex gap-1 overflow-x-auto py-2">
        <Link
          href="/catalogo"
          className="whitespace-nowrap rounded px-3 py-1 text-sm font-medium text-wf-ink hover:bg-wf-surface"
        >
          Todos
        </Link>
        {categorias.map((c) => (
          <Link
            key={c.slug}
            href={`/catalogo?categoria=${c.slug}`}
            className="whitespace-nowrap rounded px-3 py-1 text-sm text-wf-text hover:bg-wf-surface"
          >
            {c.nome}
          </Link>
        ))}
      </div>
    </nav>
  );
}
