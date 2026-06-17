"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categorias } from "@/data/categorias";

// Logo clicavel que abre um submenu com a arvore principal do site (S01-11).
// Leva o acesso ao institucional para o topo, nao so no rodape.
const institucional = [
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/revendedores", label: "Revendedores" },
  { href: "/catalogos", label: "Catalogos" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
  { href: "/sac", label: "SAC" },
];

const itemClasse = "block rounded px-2 py-1.5 text-sm text-wf-text hover:bg-wf-bg hover:text-wf-accent";

export default function LogoMenu() {
  const [aberto, setAberto] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberto) return;
    function onClickFora(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    function onTecla(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAberto(false);
        botaoRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onClickFora);
    document.addEventListener("keydown", onTecla);
    return () => {
      document.removeEventListener("mousedown", onClickFora);
      document.removeEventListener("keydown", onTecla);
    };
  }, [aberto]);

  const fechar = () => setAberto(false);

  return (
    <div ref={wrapRef} className="relative shrink-0">
      <button
        ref={botaoRef}
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-haspopup="true"
        aria-expanded={aberto}
        aria-controls="logo-submenu"
        className="flex items-center gap-1 text-lg font-bold text-wf-ink"
      >
        bb<span className="text-wf-accent">brindes</span>
        <svg
          className={`h-4 w-4 text-wf-muted transition-transform ${aberto ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {aberto && (
        <div
          id="logo-submenu"
          className="absolute left-0 top-full z-30 mt-2 w-72 rounded-lg border border-wf-line bg-wf-surface p-2 shadow-lg"
        >
          <nav aria-label="Navegacao principal">
            <Link href="/" onClick={fechar} className={`${itemClasse} font-medium text-wf-ink`}>
              Pagina inicial
            </Link>

            <div className="mt-1 border-t border-wf-line pt-1">
              <p className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-wf-muted">
                Institucional
              </p>
              {institucional.map((l) => (
                <Link key={l.href} href={l.href} onClick={fechar} className={itemClasse}>
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="mt-1 border-t border-wf-line pt-1">
              <p className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-wf-muted">
                Categorias
              </p>
              {categorias.map((c) => (
                <Link
                  key={c.slug}
                  href={`/catalogo?categoria=${c.slug}`}
                  onClick={fechar}
                  className={itemClasse}
                >
                  {c.nome}
                </Link>
              ))}
              <Link href="/catalogo" onClick={fechar} className={`${itemClasse} text-wf-accent`}>
                Ver todas as categorias
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
