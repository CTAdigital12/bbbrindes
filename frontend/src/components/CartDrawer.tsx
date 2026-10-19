"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { useCartUI } from "@/lib/cart-ui";
import { imgSrc } from "@/lib/asset";
import Icon from "@/components/Icon";

// Gaveta de orcamento (drawer da DIREITA, #cartd) espelhando cartHTML() do
// mockup funcional da Joy, com as classes verbatim do joy.css (.scrim, .drawer,
// .dh, .db, .df, .ci, .xbtn). Montada globalmente no layout: abre pelo botao
// "Orcamento" do Header e ao adicionar um item (quick-add, PDP, quickview).
//
// As sugestoes "Combina com o seu pedido" do mockup dependem da lista completa
// de produtos (server-side) e foram OMITIDAS de proposito (nao sao essenciais).
// O link para a pagina completa de orcamento fica no rodape da gaveta.

const fmt = (n: number) => n.toLocaleString("pt-BR");

export default function CartDrawer() {
  const { itens, remover } = useCart();
  const { aberto, fechar } = useCartUI();
  const pathname = usePathname();

  // Fecha ao trocar de rota (ex.: "Revisar e enviar orcamento" leva a /orcamento).
  useEffect(() => {
    fechar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // body.drawer-on + trava de scroll enquanto a gaveta esta aberta, igual aos
  // outros overlays (menu mobile do Header, filtro do catalogo) e ao open() do
  // mockup. Esconde o WhatsApp flutuante (regra ja no joy.css).
  useEffect(() => {
    document.body.classList.toggle("drawer-on", aberto);
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.classList.remove("drawer-on");
      document.body.style.overflow = "";
    };
  }, [aberto]);

  // Esc fecha (igual ao keydown global do mockup).
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [fechar]);

  return (
    <>
      <div className={`scrim${aberto ? " on" : ""}`} onClick={fechar} aria-hidden="true" />

      <aside
        className={`drawer${aberto ? " on" : ""}`}
        id="cartd"
        aria-label="Seu orçamento"
        aria-hidden={!aberto}
      >
        <div className="dh">
          <b>Seu orçamento{itens.length ? ` (${itens.length})` : ""}</b>
          <button type="button" className="xbtn" onClick={fechar} aria-label="Fechar">
            <Icon name="x" />
          </button>
        </div>

        <div className="db">
          {itens.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>Nenhum produto ainda.</p>
          ) : (
            itens.map((it, k) => {
              const src = imgSrc(it.imagem);
              return (
                <div className="ci" key={`${it.produtoSlug}-${it.cor}`}>
                  {src ? (
                    <img src={src} alt="" />
                  ) : (
                    <span
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 12,
                        background: "var(--g-card)",
                        display: "block",
                      }}
                    />
                  )}
                  <div>
                    <b>{it.nome}</b>
                    <small>
                      {fmt(it.quantidade)} un.{it.cor ? ` · ${it.cor}` : ""}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="xbtn"
                    onClick={() => remover(k)}
                    aria-label="Remover"
                  >
                    <Icon name="trash" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="df">
          {itens.length > 0 && (
            <Link
              href="/orcamento"
              className="btn btn-cta btn-lg btn-block"
              onClick={fechar}
            >
              Revisar e enviar orçamento
              <Icon name="arrow-right" />
            </Link>
          )}
          <button type="button" className="btn btn-ghost btn-block" onClick={fechar}>
            Continuar escolhendo
          </button>
        </div>
      </aside>
    </>
  );
}
