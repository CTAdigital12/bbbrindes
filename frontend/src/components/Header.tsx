"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import CategoryMenu from "@/components/CategoryMenu";
import LogoMenu from "@/components/LogoMenu";

export default function Header() {
  const { totalItens } = useCart();
  const router = useRouter();
  const [busca, setBusca] = useState("");

  function submeterBusca(e: React.FormEvent) {
    e.preventDefault();
    const q = busca.trim();
    router.push(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
  }

  return (
    <header className="border-b border-wf-line bg-wf-surface">
      <div className="wf-container flex items-center gap-4 py-3">
        <LogoMenu />

        <form onSubmit={submeterBusca} className="flex flex-1 items-center" role="search">
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produtos, categorias, palavras-chave..."
            className="wf-input rounded-r-none"
            aria-label="Buscar produtos"
          />
          <button type="submit" className="wf-btn-primary rounded-l-none">
            Buscar
          </button>
        </form>

        <nav className="flex shrink-0 items-center gap-2">
          <Link href="/revendedor/login" className="wf-btn-ghost hidden sm:inline-flex">
            Revendedor
          </Link>
          <Link href="/orcamento" className="wf-btn-ghost relative">
            Orcamento
            <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-wf-accent px-1 text-xs text-white">
              {totalItens}
            </span>
          </Link>
        </nav>
      </div>

      <CategoryMenu />
    </header>
  );
}
