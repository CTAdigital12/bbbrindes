"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Produto } from "@/lib/types";
import { categorias, nomeCategoria } from "@/data/categorias";
import { aplicacoes, produtos as produtosMock } from "@/data/produtos";
import { useCart } from "@/lib/cart";
import { useCartUI } from "@/lib/cart-ui";
import { imgSrc } from "@/lib/asset";
import { WA, nb } from "@/data/home-joy";
import Icon from "@/components/Icon";
import ProductCardJoy from "@/components/ProductCardJoy";

// Catalogo da Joy (espelha a funcao catalogo() do mockup funcional). Classes
// verbatim do design-system.css: .crumb, .ptitle, .cat-l, .filt, .cbar, .pgrid, .empty,
// .modal#qv. Produtos REAIS vindos de getProdutos (passados pelo page.tsx);
// filtro e ordenacao 100% client-side. Sem faixa de preco (o site nao mostra
// preco). A leitura inicial dos filtros vem da querystring (?categoria=, ?q=,
// ?material=, ?aplicacao=, ?cor=); mudancas na pagina ficam em estado local.

type Grupo = "categoria" | "material" | "aplicacao" | "cor";
type Facetas = Record<Grupo, string[]>;
type Ord = "rel" | "novo" | "az";

// Taxonomia fixa dos filtros, igual ao mockup. Material e as 6 aplicacoes de
// data/produtos.ts; cor com a bolinha (hex do COR do mockup).
const MATERIAIS = ["Fibra natural", "Plastico"];
const CORES: { valor: string; cor: string }[] = [
  { valor: "Natural", cor: "#d9c7a6" },
  { valor: "Fibra", cor: "#6b4a33" },
  { valor: "Verde", cor: "#3f8f3a" },
  { valor: "Azul", cor: "#1f4fb4" },
  { valor: "Vermelho", cor: "#c8202c" },
  { valor: "Roxo", cor: "#5a2d91" },
  { valor: "Branco", cor: "#f7f7f7" },
  { valor: "Preto", cor: "#2a2a2a" },
];

const norm = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const toOrd = (v: string | null): Ord => (v === "novo" || v === "az" ? v : "rel");
const ehNovo = (p: Produto) => (p.destaques ?? []).includes("lancamento");

export default function CatalogoClient({ produtos = produtosMock }: { produtos?: Produto[] }) {
  const sp = useSearchParams();
  const spKey = sp.toString();

  // Filtros de facetas (checkbox) ficam em estado; inicializam da querystring.
  const [facetas, setFacetas] = useState<Facetas>(() => ({
    categoria: sp.getAll("categoria"),
    material: sp.getAll("material"),
    aplicacao: sp.getAll("aplicacao"),
    cor: sp.getAll("cor"),
  }));
  const [ord, setOrd] = useState<Ord>(() => toOrd(sp.get("ord")));
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [qvProduto, setQvProduto] = useState<Produto | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // q e novo vem direto da URL (nao sao chips nem checkbox): so filtram e
  // definem o titulo. Busca mora no header; "Lancamentos" vem de ?novo=1.
  const q = sp.get("q") ?? "";
  const novo = sp.get("novo");

  const { adicionar } = useCart();
  const { abrir } = useCartUI();

  // Recarrega os filtros quando a querystring muda (busca do header, link de
  // categoria, "Limpar"). Alteracoes feitas na propria pagina nao mexem na URL.
  useEffect(() => {
    setFacetas({
      categoria: sp.getAll("categoria"),
      material: sp.getAll("material"),
      aplicacao: sp.getAll("aplicacao"),
      cor: sp.getAll("cor"),
    });
    setOrd(toOrd(sp.get("ord")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spKey]);

  // Botao "Filtros" (.mfil) e o drawer da esquerda so no mobile (<=760), como o
  // JS do mockup. Fora disso a sidebar fica fixa (sticky).
  useEffect(() => {
    const mq = window.matchMedia("(max-width:760px)");
    const atualizar = () => setIsMobile(mq.matches);
    atualizar();
    mq.addEventListener("change", atualizar);
    return () => mq.removeEventListener("change", atualizar);
  }, []);

  // Scrim/overlay aberto (drawer de filtro no mobile OU quickview): esconde o
  // WhatsApp flutuante (body.drawer-on) e trava o scroll, como o open() do mockup.
  const overlayAberto = (filtrosAbertos && isMobile) || qvProduto !== null;
  useEffect(() => {
    document.body.classList.toggle("drawer-on", overlayAberto);
    document.body.style.overflow = overlayAberto ? "hidden" : "";
    return () => {
      document.body.classList.remove("drawer-on");
      document.body.style.overflow = "";
    };
  }, [overlayAberto]);

  // Fecha filtro/quickview no Esc.
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFiltrosAbertos(false);
        setQvProduto(null);
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, []);

  function alternar(grupo: Grupo, valor: string) {
    setFacetas((f) => {
      const tem = f[grupo].includes(valor);
      return { ...f, [grupo]: tem ? f[grupo].filter((v) => v !== valor) : [...f[grupo], valor] };
    });
  }

  function fecharOverlays() {
    setFiltrosAbertos(false);
    setQvProduto(null);
  }

  function adicionarQuickview(p: Produto) {
    adicionar({
      produtoSlug: p.slug,
      nome: p.nome,
      cor: p.cores?.[0]?.nome ?? "",
      quantidade: 500,
      imagem: p.imagens?.[0],
    });
    // Fecha o quickview e abre a gaveta de orcamento (como o addToCart do mockup).
    setQvProduto(null);
    abrir();
  }

  // Contagens por opcao (.n): total de produtos por valor, sobre a lista inteira
  // (independente dos filtros ativos), igual ao grp() do mockup.
  const contar = (pred: (p: Produto) => boolean) => produtos.filter(pred).length;

  const resultados = useMemo(() => {
    const nq = norm(q);
    const lista = produtos.filter((p) => {
      if (facetas.categoria.length && !facetas.categoria.includes(p.categoria)) return false;
      if (facetas.material.length && !facetas.material.some((m) => norm(m) === norm(p.material)))
        return false;
      if (
        facetas.aplicacao.length &&
        !(p.aplicacoes ?? []).some((a) => facetas.aplicacao.some((fa) => norm(fa) === norm(a)))
      )
        return false;
      if (
        facetas.cor.length &&
        !(p.cores ?? []).some((c) => facetas.cor.some((fc) => norm(fc) === norm(c.nome)))
      )
        return false;
      if (nq) {
        const alvo = norm(`${p.nome} ${nomeCategoria(p.categoria)} ${p.descricao} ${p.material}`);
        if (!alvo.includes(nq)) return false;
      }
      if (novo && !ehNovo(p)) return false;
      return true;
    });
    if (ord === "az") return [...lista].sort((a, b) => a.nome.localeCompare(b.nome));
    if (ord === "novo") return [...lista].sort((a, b) => Number(ehNovo(b)) - Number(ehNovo(a)));
    return lista;
  }, [produtos, facetas, q, novo, ord]);

  // Titulo dinamico da .ptitle (mesma regra do mockup).
  const titulo =
    facetas.categoria.length === 1
      ? nomeCategoria(facetas.categoria[0])
      : q
        ? `Resultados para “${q}”`
        : novo
          ? "Lançamentos"
          : "Catálogo";

  // Chips de filtro ativo (removiveis): categoria/material/aplicacao/cor.
  const chips: { grupo: Grupo; valor: string; rotulo: string }[] = [
    ...facetas.categoria.map((v) => ({ grupo: "categoria" as const, valor: v, rotulo: nomeCategoria(v) })),
    ...facetas.material.map((v) => ({ grupo: "material" as const, valor: v, rotulo: v })),
    ...facetas.aplicacao.map((v) => ({ grupo: "aplicacao" as const, valor: v, rotulo: v })),
    ...facetas.cor.map((v) => ({ grupo: "cor" as const, valor: v, rotulo: v })),
  ];

  // Renderiza um grupo de filtro (grp() do mockup): titulo + checkboxes com .n.
  const grupo = (
    tituloGrupo: string,
    chave: Grupo,
    opcoes: { valor: string; rotulo: string; contagem: number; cor?: string }[],
  ) => (
    <>
      <h4>{tituloGrupo}</h4>
      {opcoes.map((o) => (
        <label key={o.valor}>
          <input
            type="checkbox"
            checked={facetas[chave].includes(o.valor)}
            onChange={() => alternar(chave, o.valor)}
          />
          {o.cor && (
            <i
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: o.cor,
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,.15)",
              }}
            />
          )}
          {o.rotulo}
          <span className="n">{o.contagem}</span>
        </label>
      ))}
    </>
  );

  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<span>{titulo}</span>
      </div>

      <div className="ptitle">
        <h1>{titulo}</h1>
        <p>
          Brindes corporativos personalizados com a sua marca, fabricados no Brasil. Pedidos a
          partir de 500 unidades.
        </p>
      </div>

      <div className="cat-l">
        <aside className={`filt${filtrosAbertos ? " on" : ""}`} id="filt">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <b>Filtros</b>
            <Link className="link" href="/catalogo" style={{ fontSize: 13 }}>
              Limpar
            </Link>
          </div>

          {grupo(
            "Categoria",
            "categoria",
            categorias.map((c) => ({
              valor: c.slug,
              rotulo: c.nome,
              contagem: contar((p) => p.categoria === c.slug),
            })),
          )}
          {grupo(
            "Material",
            "material",
            MATERIAIS.map((m) => ({
              valor: m,
              rotulo: m,
              contagem: contar((p) => norm(p.material) === norm(m)),
            })),
          )}
          {grupo(
            "Aplicação",
            "aplicacao",
            aplicacoes.map((a) => ({
              valor: a,
              rotulo: a,
              contagem: contar((p) => (p.aplicacoes ?? []).some((x) => norm(x) === norm(a))),
            })),
          )}
          {grupo(
            "Cor",
            "cor",
            CORES.map((c) => ({
              valor: c.valor,
              rotulo: c.valor,
              cor: c.cor,
              contagem: contar((p) => (p.cores ?? []).some((x) => norm(x.nome) === norm(c.valor))),
            })),
          )}
        </aside>

        <div>
          <div className="cbar">
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              {isMobile && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm mfil"
                  onClick={() => setFiltrosAbertos(true)}
                >
                  <Icon name="adjustments-horizontal" />
                  Filtros
                </button>
              )}
              <b>
                {resultados.length} produto{resultados.length === 1 ? "" : "s"}
              </b>
              <div className="act">
                {chips.map((c) => (
                  <button
                    key={`${c.grupo}-${c.valor}`}
                    type="button"
                    onClick={() => alternar(c.grupo, c.valor)}
                  >
                    {c.rotulo} <Icon name="x" />
                  </button>
                ))}
              </div>
            </div>
            <select
              className="sel"
              id="ord"
              aria-label="Ordenar"
              value={ord}
              onChange={(e) => setOrd(toOrd(e.target.value))}
            >
              <option value="rel">Mais pedidos</option>
              <option value="novo">Lançamentos</option>
              <option value="az">A–Z</option>
            </select>
          </div>

          {resultados.length ? (
            <div className="pgrid">
              {resultados.map((p) => (
                <ProductCardJoy
                  key={p.slug}
                  produto={p}
                  quickActions
                  onQuickview={(prod) => setQvProduto(prod)}
                />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3 style={{ margin: "0 0 6px" }}>Nenhum produto com esses filtros</h3>
              <p style={{ color: "var(--muted)" }}>
                Fale com um especialista: fabricamos projetos especiais sob demanda.
              </p>
              <a className="btn btn-wa" href={WA} target="_blank" rel="noopener">
                <Icon name="brand-whatsapp" />
                Falar no WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Scrim compartilhado: drawer de filtro (mobile) + quickview. */}
      <div
        className={`scrim${overlayAberto ? " on" : ""}`}
        onClick={fecharOverlays}
        aria-hidden="true"
      />

      {/* Quickview (.modal#qv). Sempre no DOM (fica invisivel ate abrir). */}
      <div
        className={`modal${qvProduto ? " on" : ""}`}
        id="qv"
        role="dialog"
        aria-modal="true"
        aria-hidden={!qvProduto}
      >
        {qvProduto && (
          <>
            <div className="mph">
              {imgSrc(qvProduto.imagens?.[0]) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imgSrc(qvProduto.imagens?.[0])} alt={qvProduto.nome} />
              ) : null}
            </div>
            <div className="mbd">
              <button
                type="button"
                className="xbtn"
                onClick={() => setQvProduto(null)}
                aria-label="Fechar"
              >
                <Icon name="x" />
              </button>
              <span className="eyebrow">{nomeCategoria(qvProduto.categoria)}</span>
              <h2 style={{ margin: 0, fontSize: 26, lineHeight: 1.15, letterSpacing: "-.02em" }}>
                {nb(qvProduto.nome)}
              </h2>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                {qvProduto.descricao ||
                  "Personalizado com a sua logomarca. Pedido mínimo de 500 unidades."}
              </p>
              <div className="sw">
                {(qvProduto.cores ?? []).slice(0, 5).map((c) => (
                  <i key={c.nome} style={{ background: c.hex }} />
                ))}
                {(qvProduto.cores ?? []).length > 5 && (
                  <small style={{ fontSize: "11px", color: "var(--muted)" }}>
                    +{(qvProduto.cores ?? []).length - 5}
                  </small>
                )}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(qvProduto.tags ?? []).includes("ecologico") && (
                  <span className="chip chip-sage">Ecológico</span>
                )}
                <span className="chip chip-sage">Uso permanente</span>
              </div>
              <button
                type="button"
                className="btn btn-cta btn-lg"
                style={{ marginTop: "auto" }}
                onClick={() => adicionarQuickview(qvProduto)}
              >
                <Icon name="plus" />
                Adicionar ao orçamento
              </button>
              <Link className="link" href={`/produto/${qvProduto.slug}`}>
                Ver detalhes do produto <Icon name="arrow-right" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
