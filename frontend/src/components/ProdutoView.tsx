"use client";

/* eslint-disable @next/next/no-img-element */

import { type MouseEvent, useEffect, useRef, useState } from "react";
import type { Produto } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { useCartUI } from "@/lib/cart-ui";
import { nomeCategoria } from "@/data/categorias";
import { WA, nb } from "@/data/home-joy";
import { imgSrc } from "@/lib/asset";
import Icon from "@/components/Icon";
import Link from "next/link";

// PDP (galeria + configurador + barra de compra fixa) espelhando a funcao
// produto() do mockup funcional da Joy, com as classes verbatim do design-system.css
// (.pd, .gal, .thumbs, .stage, .ring, .fl, .pinfo, .sub, .blk, .colors, .seg2,
// .seg, .step, .warn, .buy#buyrow, .assure, .sticky-buy#sbuy). Dado REAL do
// Payload (getProdutoBySlug); cores e imagens de produto.cores / produto.imagens.

const MIN_QTD = 500;
const PRESETS = [500, 1000, 3000, 5000];
const PASSO = 100;
const fmt = (n: number) => n.toLocaleString("pt-BR");

type GalItem = { cor: string; src: string };

export default function ProdutoView({ produto }: { produto: Produto }) {
  const { adicionar } = useCart();
  const { abrir } = useCartUI();

  const cores = produto.cores ?? [];
  const imagens = produto.imagens ?? [];
  // Sincronia cor<->imagem: quando ha uma foto por cor (mesma quantidade), cada
  // miniatura representa uma cor; clicar numa troca a outra (o Squeeze-modelo tem
  // 1 foto por cor). Fora disso as miniaturas sao so as imagens do produto.
  const synced = imagens.length > 0 && imagens.length === cores.length;
  const gal: GalItem[] = synced
    ? cores.map((c, i) => ({ cor: c.nome, src: imagens[i] }))
    : imagens.map((src) => ({ cor: "", src }));

  const [corNome, setCorNome] = useState(cores[0]?.nome ?? "");
  const [imgIdx, setImgIdx] = useState(0);
  const [qtd, setQtd] = useState(MIN_QTD);
  const [pers, setPers] = useState<"transfer" | "serigrafia">("transfer");
  const [sbOn, setSbOn] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const qinRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const abaixoDoMinimo = qtd < MIN_QTD;

  // Flags da estante (.fl): Novo (lancamento), Livre de BPA (selo/atoxidade),
  // Uso permanente e Reciclavel. Espelha o bloco .fl do produto() do mockup.
  const novo = (produto.destaques ?? []).includes("lancamento");
  const livreBpa =
    (produto.detalhe?.selos ?? []).some((s) => /bpa/i.test(s)) ||
    (produto.tags ?? []).some((t) => /bpa/i.test(t));

  const stageSrc = imgSrc(gal[imgIdx]?.src);
  const mainSrc = imgSrc(imagens[0]);
  const waText = `${WA}?text=${encodeURIComponent("Olá! Quero um orçamento de " + produto.nome)}`;

  // Barra de compra fixa: aparece quando o #buyrow sai da viewport por cima
  // (IntersectionObserver), como o after()/sbObs do mockup. body.sb-on sobe o
  // WhatsApp flutuante (regra ja no design-system.css).
  useEffect(() => {
    const alvo = buyRef.current;
    if (!alvo || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      ([e]) => setSbOn(!e.isIntersecting && e.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    obs.observe(alvo);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("sb-on", sbOn);
    return () => document.body.classList.remove("sb-on");
  }, [sbOn]);

  function toast(msg: string) {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 2600);
  }

  // Zoom no mousemove sobre a .stage (scale 1.6 com origem no cursor), igual ao
  // mockup. Mexe direto no style do <img> via ref para nao re-renderizar.
  function aoMover(e: MouseEvent<HTMLDivElement>) {
    const st = stageRef.current;
    const im = imgRef.current;
    if (!st || !im) return;
    const r = st.getBoundingClientRect();
    im.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    im.style.transform = "scale(1.6)";
  }
  function aoSair() {
    if (imgRef.current) imgRef.current.style.transform = "";
  }

  function escolherThumb(i: number) {
    setImgIdx(i);
    const c = gal[i]?.cor;
    if (c) setCorNome(c);
  }
  function escolherCor(i: number) {
    setCorNome(cores[i].nome);
    if (synced) setImgIdx(i);
  }

  function aoAdicionar() {
    if (abaixoDoMinimo) {
      qinRef.current?.focus();
      toast("O pedido mínimo é de 500 unidades");
      return;
    }
    adicionar({
      produtoSlug: produto.slug,
      nome: produto.nome,
      cor: corNome,
      quantidade: qtd,
      imagem: gal[imgIdx]?.src ?? imagens[0],
    });
    abrir();
    toast("Adicionado ao orçamento");
  }

  return (
    <>
      <div className="pd">
        {/* Galeria: coluna de miniaturas + palco com zoom */}
        <div className="gal">
          <div className="thumbs">
            {gal.map((g, i) => (
              <button
                key={`${g.src}-${i}`}
                type="button"
                className={i === imgIdx ? "on" : ""}
                onClick={() => escolherThumb(i)}
                aria-label={`Imagem ${i + 1}`}
              >
                <img src={imgSrc(g.src)} alt="" />
              </button>
            ))}
          </div>

          <div
            className="stage"
            id="stage"
            ref={stageRef}
            onMouseMove={aoMover}
            onMouseLeave={aoSair}
          >
            <span className="halo" />
            {stageSrc ? <img id="mimg" ref={imgRef} src={stageSrc} alt={produto.nome} /> : null}
            <div className="fl">
              {novo && <span className="chip chip-orange">Novo</span>}
              {livreBpa && <span className="chip chip-sage">Livre de BPA</span>}
              <span className="chip chip-sage">Uso permanente</span>
              <span className="chip chip-sage">Reciclável</span>
            </div>
          </div>
        </div>

        {/* Informacoes + configurador */}
        <div className="pinfo">
          <div>
            <Link className="cat" href={`/catalogo?categoria=${produto.categoria}`}>
              {nomeCategoria(produto.categoria)}
            </Link>
            <h1>{nb(produto.nome)}</h1>
          </div>
          <p className="sub">
            {produto.detalhe?.linhaCurta ||
              produto.descricao ||
              `${produto.nome} personalizado com a sua logomarca, fabricado no Brasil. Pedidos a partir de 500 unidades.`}
          </p>

          <div className="blk">
            {cores.length > 0 && (
              <div>
                <div className="lbl">
                  Cor <span id="corl">{corNome}</span>
                </div>
                <div className="colors">
                  {cores.map((c, i) => (
                    <button
                      key={c.nome}
                      type="button"
                      className={c.nome === corNome ? "on" : ""}
                      style={{ background: c.hex }}
                      onClick={() => escolherCor(i)}
                      aria-label={c.nome}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="lbl">Personalização</div>
              <div className="seg2">
                <button
                  type="button"
                  className={pers === "transfer" ? "on" : ""}
                  onClick={() => setPers("transfer")}
                >
                  <b>Heat transfer</b>Cores ilimitadas, ideal para logos com degradê
                </button>
                <button
                  type="button"
                  className={pers === "serigrafia" ? "on" : ""}
                  onClick={() => setPers("serigrafia")}
                >
                  <b>Serigrafia</b>Até 4 cores, acabamento sólido e durável
                </button>
              </div>
            </div>

            <div>
              <div className="lbl">
                Quantidade <span>mínimo 500 unidades</span>
              </div>
              <div className="seg">
                {PRESETS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={qtd === n ? "on" : ""}
                    onClick={() => setQtd(n)}
                  >
                    {fmt(n)}
                  </button>
                ))}
              </div>
              <div className="qty">
                <div className="step">
                  <button
                    type="button"
                    onClick={() => setQtd((q) => Math.max(PASSO, q - PASSO))}
                    aria-label="Menos"
                  >
                    <Icon name="minus" />
                  </button>
                  <input
                    id="qin"
                    ref={qinRef}
                    inputMode="numeric"
                    value={qtd}
                    onChange={(e) => setQtd(parseInt(e.target.value.replace(/\D/g, ""), 10) || 0)}
                    aria-label="Quantidade"
                  />
                  <button type="button" onClick={() => setQtd((q) => q + PASSO)} aria-label="Mais">
                    <Icon name="plus" />
                  </button>
                </div>
                <small>ou digite a quantidade exata</small>
              </div>
              <div className={`warn${abaixoDoMinimo ? " on" : ""}`} id="qw">
                O pedido mínimo é de 500 unidades. Para volumes menores, fale com o especialista.
              </div>
            </div>

            <div className="buy" id="buyrow" ref={buyRef}>
              <button type="button" className="btn btn-cta btn-lg" onClick={aoAdicionar}>
                <Icon name="shopping-bag" />
                Adicionar ao orçamento
              </button>
              <a
                className="btn btn-ghost btn-lg"
                href={waText}
                target="_blank"
                rel="noopener"
                aria-label="WhatsApp"
              >
                <Icon name="brand-whatsapp" />
              </a>
            </div>

            <div className="assure">
              <div>
                <Icon name="circle-check" />
                <span>
                  <b>Sem pagamento online.</b> Você monta o orçamento e um especialista retorna com a
                  proposta.
                </span>
              </div>
              <div>
                <Icon name="building-factory-2" />
                <span>
                  Fabricado pela BB Brindes, empresa do Grupo BB. Prazo de produção informado na
                  proposta.
                </span>
              </div>
              <div>
                <Icon name="truck-delivery" />
                <span>Entrega para todo o Brasil.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de compra fixa no rodape (#sbuy) */}
      <div className={`sticky-buy${sbOn ? " on" : ""}`} id="sbuy">
        <div className="wrap">
          {mainSrc ? <img src={mainSrc} alt="" /> : null}
          <div className="info">
            <b>{produto.nome}</b>
            <small id="sbinfo">
              {fmt(qtd)} unidades{corNome ? ` · ${corNome}` : ""}
            </small>
          </div>
          <div className="r">
            <a className="btn btn-ghost" href={WA} target="_blank" rel="noopener">
              <Icon name="brand-whatsapp" />
              Especialista
            </a>
            <button type="button" className="btn btn-cta" onClick={aoAdicionar}>
              <Icon name="shopping-bag" />
              Adicionar ao orçamento
            </button>
          </div>
        </div>
      </div>

      {/* Toast de confirmacao (espelha o toast() do mockup) */}
      <div className={`toast${toastMsg ? " on" : ""}`} role="status" aria-live="polite">
        <Icon name="circle-check" />
        <span>{toastMsg}</span>
      </div>
    </>
  );
}
