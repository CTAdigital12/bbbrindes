"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import LogoMenu from "@/components/LogoMenu";

export default function Header() {
  const { totalItens } = useCart();
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [encolhido, setEncolhido] = useState(false);

  // Header fixo que encolhe um pouco ao rolar, em vez de sumir (pedido Fabio).
  useEffect(() => {
    const onScroll = () => setEncolhido(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function submeterBusca(e: React.FormEvent) {
    e.preventDefault();
    const q = busca.trim();
    router.push(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
  }

  return (
    <header
      className={`sticky top-0 z-40 border-b border-wf-line bg-wf-surface transition-shadow ${
        encolhido ? "shadow-sm" : ""
      }`}
    >
      {/* flex-wrap: no mobile a busca vai para uma 2a linha full-width (catalogo
          precisa da busca sempre visivel); no desktop tudo fica em 1 linha. */}
      <div
        className={`wf-container flex flex-wrap items-center gap-x-4 gap-y-3 transition-all duration-200 ${
          encolhido ? "py-1.5" : "py-3"
        }`}
      >
        <div className="order-1">
          <LogoMenu />
        </div>

        <form
          onSubmit={submeterBusca}
          className="order-3 flex w-full items-center sm:order-2 sm:w-auto sm:flex-1"
          role="search"
        >
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produtos, categorias, palavras-chave..."
            className="wf-input min-w-0 flex-1 rounded-r-none"
            aria-label="Buscar produtos"
          />
          <button type="submit" className="wf-btn-primary shrink-0 rounded-l-none">
            Buscar
          </button>
        </form>

        <nav className="order-2 ml-auto flex shrink-0 items-center gap-2 sm:order-3 sm:ml-0">
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
    </header>
  );
}
