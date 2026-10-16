"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import Icon from "@/components/Icon";
import { campanhas } from "@/data/campanhas";

// Links de categoria da barra de navegacao (subconjunto curado, igual ao mockup
// da Joy). Apontam pras rotas reais do App Router (/catalogo?categoria=slug).
const CATS: { label: string; href: string; hot?: boolean }[] = [
  { label: "Todos os produtos", href: "/catalogo" },
  { label: "Ecologicos", href: "/catalogo?categoria=green-plasticaria" },
  { label: "Copos", href: "/catalogo?categoria=copos" },
  { label: "Canecas e xicaras", href: "/catalogo?categoria=canecas-xicaras" },
  { label: "Squeezes", href: "/catalogo?categoria=squeezes" },
  { label: "To go", href: "/catalogo?categoria=to-go-viagem" },
  { label: "Infantil", href: "/catalogo?categoria=infantil" },
  { label: "Lancamentos", href: "/catalogo" },
];

const INST: { label: string; href: string }[] = [
  { label: "Quem somos", href: "/quem-somos" },
  { label: "Cases", href: "/cases" },
  { label: "Blog", href: "/blog" },
  { label: "Catalogos", href: "/catalogos" },
  { label: "Contato", href: "/contato" },
  { label: "SAC", href: "/sac" },
];

const PROMESSAS: { icon: string; texto: string }[] = [
  { icon: "building-factory-2", texto: "Fabrica propria ha 27 anos" },
  { icon: "package", texto: "Pedidos a partir de 500 unidades" },
  { icon: "truck-delivery", texto: "Entrega para todo o Brasil" },
  { icon: "certificate", texto: "Atoxidade certificada" },
];

export default function Header() {
  const { totalItens } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [busca, setBusca] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [campOpen, setCampOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha overlays ao trocar de rota.
  useEffect(() => {
    setMenuOpen(false);
    setCampOpen(false);
  }, [pathname]);

  // Esconde o WhatsApp flutuante e trava o scroll quando o menu mobile abre.
  useEffect(() => {
    document.body.classList.toggle("drawer-on", menuOpen);
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.classList.remove("drawer-on");
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function submeterBusca(e: React.FormEvent) {
    e.preventDefault();
    const q = busca.trim();
    router.push(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
    setMenuOpen(false);
  }

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <div className="rot" aria-hidden="true">
            {PROMESSAS.map((p) => (
              <span key={p.texto}>
                <Icon name={p.icon} />
                {p.texto}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <a href="https://wa.me/557191717496" target="_blank" rel="noopener">
              <Icon name="brand-whatsapp" />
              (71) 9171-7496
            </a>
          </div>
        </div>
      </div>

      <header className={`site${scrolled ? " scrolled" : ""}`}>
        <div className="wrap hrow">
          <button
            className="menu-m xbtn"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <Icon name="menu-2" />
          </button>

          <Link href="/" className="logo" aria-label="BB Brindes, pagina inicial" />

          <form className="search" role="search" onSubmit={submeterBusca}>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Busque por produto, categoria ou ocasiao"
              aria-label="Buscar"
            />
            <button type="submit" aria-label="Buscar">
              <Icon name="search" />
            </button>
          </form>

          <div className="hact">
            <Link href="/revendedor/login" className="btn btn-ghost btn-sm rev">
              Revendedor
            </Link>
            <Link
              href="/orcamento"
              className="btn btn-deep btn-sm cartbtn"
              aria-label="Meu orcamento"
            >
              <Icon name="shopping-bag" />
              <span className="lbl-c">Orcamento</span>
              <span className="badge">{totalItens}</span>
            </Link>
          </div>
        </div>

        <nav className="cats">
          <div className="wrap">
            {CATS.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className={pathname === c.href ? "on" : undefined}
              >
                {c.label}
              </Link>
            ))}
            <button
              type="button"
              className={`ddb${campOpen ? " on" : ""}`}
              onClick={() => setCampOpen((o) => !o)}
              aria-expanded={campOpen}
            >
              <Icon name="alarm" />
              Campanhas
              <Icon name="chevron-down" />
            </button>
            <Link href="/campanha/natal" className="hot">
              Natal
            </Link>
            <Link href="/quem-somos">Quem somos</Link>
            <Link href="/cases">Cases</Link>
          </div>

          <div className={`ddp${campOpen ? " on" : ""}`}>
            <div className="wrap">
              <div className="ddh">
                <b>Campanhas e datas</b>
                <span>Brindes certos para cada ocasiao do ano</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {campanhas.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/campanha/${c.slug}`}
                    className="chip chip-sage"
                    style={{ height: "auto", padding: "8px 14px" }}
                  >
                    <strong style={{ fontWeight: 600 }}>{c.mes}</strong>
                    {" · "}
                    {c.nome}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Menu mobile (drawer da esquerda). Chrome pelo joy.css, miolo em Tailwind. */}
      <div
        className={`scrim${menuOpen ? " on" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`drawer left${menuOpen ? " on" : ""}`}
        aria-label="Menu"
        aria-hidden={!menuOpen}
      >
        <div className="dh">
          <span className="logo" style={{ width: 120, height: 30 }} aria-label="BB Brindes" />
          <button className="xbtn" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
            <Icon name="x" />
          </button>
        </div>
        <div className="db">
          <form className="search" role="search" onSubmit={submeterBusca} style={{ maxWidth: "none" }}>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar..."
              aria-label="Buscar"
            />
            <button type="submit" aria-label="Buscar">
              <Icon name="search" />
            </button>
          </form>

          <nav className="mt-5 flex flex-col">
            <span className="px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-joy-muted">
              Categorias
            </span>
            {CATS.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="rounded-pill px-3 py-2 text-[15px] font-medium text-joy-ink hover:bg-joy-cream"
              >
                {c.label}
              </Link>
            ))}
          </nav>

          <nav className="mt-5 flex flex-col border-t border-joy-line pt-4">
            <span className="px-1 pb-1 text-xs font-semibold uppercase tracking-wide text-joy-muted">
              Institucional
            </span>
            {INST.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className="rounded-pill px-3 py-2 text-[15px] font-medium text-joy-ink hover:bg-joy-cream"
              >
                {i.label}
              </Link>
            ))}
            <Link
              href="/revendedor/login"
              className="rounded-pill px-3 py-2 text-[15px] font-medium text-joy-ink hover:bg-joy-cream"
            >
              Area do revendedor
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
}
