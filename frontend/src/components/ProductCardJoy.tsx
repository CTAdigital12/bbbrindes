"use client";

import Link from "next/link";
import type { Produto } from "@/lib/types";
import { imgSrc } from "@/lib/asset";
import { nomeCategoria } from "@/data/categorias";
import { nb } from "@/data/home-joy";
import { useCart } from "@/lib/cart";
import { useCartUI } from "@/lib/cart-ui";
import Icon from "@/components/Icon";

// Minimo B2B: todo produto e personalizado a partir de 500 unidades.
const MIN_QTD = 500;

// Quick-add (.qa do mockup): botao "Adicionar ao orcamento" que aparece no hover
// do card. Fica num componente proprio para que so o catalogo (quickActions)
// assine o carrinho; na home o card nao chama useCart. Adiciona a 1a cor, 500 un.,
// e abre a gaveta de orcamento (como o addToCart() do mockup).
function QuickAdd({ produto }: { produto: Produto }) {
  const { adicionar } = useCart();
  const { abrir } = useCartUI();
  // Adiciona a 1a cor, 500 un., e abre a gaveta de orcamento (comportamento do
  // addToCart() do mockup). O badge do header ja incrementa pelo CartProvider.
  const adicionarAoOrcamento = () => {
    adicionar({
      produtoSlug: produto.slug,
      nome: produto.nome,
      cor: produto.cores?.[0]?.nome ?? "",
      quantidade: MIN_QTD,
      imagem: produto.imagens?.[0],
    });
    abrir();
  };

  return (
    <div className="qa">
      <button
        type="button"
        className="btn btn-cta btn-sm btn-block"
        onClick={adicionarAoOrcamento}
      >
        <Icon name="plus" />
        <span className="lf">Adicionar ao orçamento</span>
        <span className="ls">Adicionar</span>
      </button>
    </div>
  );
}

// Card de produto na identidade da Joy, espelhando a .card do mockup funcional:
// painel de imagem com fundo var(--g-card) + foto aplicada no hover (.alt),
// tags (Novo / Ecologico), nome, categoria (eyebrow .ln) e swatches de cor.
//
// Client-safe: usado tanto na home (server component, SEM quick-actions) quanto
// no catalogo (COM quick-actions). As quick-actions so montam quando
// `quickActions` e true: o quick-add (.qa) e o botao de quickview (.qv, que
// dispara onQuickview). Dado REAL do Payload (getProdutos), fallback no mock.
export default function ProductCardJoy({
  produto,
  quickActions = false,
  onQuickview,
}: {
  produto: Produto;
  quickActions?: boolean;
  onQuickview?: (produto: Produto) => void;
}) {
  const src = imgSrc(produto.imagens?.[0]);
  // Foto aplicada (com a marca), revelada no hover pela .ph img.alt do design-system.css.
  const fotoAplicada = imgSrc(produto.imagens?.[1]);
  const categoria = produto.categoria ? nomeCategoria(produto.categoria) : "";
  const eco = (produto.tags ?? []).includes("ecologico");
  const novo = (produto.destaques ?? []).includes("lancamento");
  const cores = produto.cores ?? [];
  const href = `/produto/${produto.slug}`;

  return (
    <article className="card">
      <div className="phw">
        <Link href={href} className="ph" aria-label={produto.nome}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={produto.nome} loading="lazy" />
          ) : null}
          {src && fotoAplicada ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="alt" src={fotoAplicada} alt="" loading="lazy" />
          ) : null}
        </Link>

        {(novo || eco) && (
          <div className="tags">
            {novo && <span className="chip chip-orange">Novo</span>}
            {eco && <span className="chip chip-sage">Ecológico</span>}
          </div>
        )}

        {quickActions && onQuickview && (
          <button
            type="button"
            className="qv"
            aria-label="Ver rápido"
            onClick={() => onQuickview(produto)}
          >
            <Icon name="eye" />
          </button>
        )}

        {quickActions && <QuickAdd produto={produto} />}
      </div>

      <div className="bd">
        {categoria && <span className="ln">{categoria}</span>}
        <h3>
          <Link href={href}>{nb(produto.nome)}</Link>
        </h3>
        <div className="meta">
          <div className="sw">
            {cores.slice(0, 5).map((c) => (
              <i key={c.nome} style={{ background: c.hex }} />
            ))}
            {cores.length > 5 && (
              <small style={{ fontSize: "11px", color: "var(--muted)" }}>
                +{cores.length - 5}
              </small>
            )}
          </div>
          <span className="min">mín. 500 un.</span>
        </div>
      </div>
    </article>
  );
}
