"use client";

/* eslint-disable @next/next/no-img-element */

import { type MouseEvent, useEffect, useRef, useState } from "react";
import type { Produto } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { useCartUI } from "@/lib/cart-ui";
import { useNomeCategoria } from "@/lib/categorias-context";
import { WA, nb } from "@/data/home-joy";
import { imgSrc } from "@/lib/asset";
import Icon from "@/components/Icon";
import Link from "next/link";

// PDP (galeria + configurador + barra de compra fixa) espelhando a funcao
// produto() do mockup funcional da Joy, com as classes verbatim do design-system.css
// (.pd, .gal, .thumbs, .stage, .ring, .fl, .pinfo, .sub, .blk, .colors,
// .seg, .step, .warn, .buy#buyrow, .assure, .sticky-buy#sbuy). Dado REAL do
// Payload (getProdutoBySlug); cores e imagens de produto.cores / produto.imagens.

const PASSO = 100;
const fmt = (n: number) => n.toLocaleString("pt-BR");

export default function ProdutoView({ produto }: { produto: Produto }) {
  const { adicionar } = useCart();
  const { abrir } = useCartUI();
  const nomeCategoria = useNomeCategoria();

  const cores = produto.cores ?? [];
  const imagens = produto.imagens ?? [];
  // Seletor de cor DESACOPLADO da foto: a bolinha e um swatch (nome/hex) e so troca
  // a foto principal quando aquela cor tem foto propria (cores[i].imagem). Hoje esse
  // campo e nulo em todo o catalogo (o importador nao casa foto<->cor: as fotos tem
  // nome generico), entao clicar numa cor so muda o nome, sem trocar a imagem. Isso
  // mata o bug de "clica numa cor, aparece outra" (os dois arrays vinham em ordens
  // diferentes e o pareamento por indice era coincidencia). Quando o backend popular
  // cores[].imagem, a troca "acende" sozinha. A galeria de miniaturas segue sendo a
  // navegacao por todas as fotos do produto.

  // Quantidade minima do pedido: vem do Payload por produto (quantidadeMinima),
  // com fallback em 500 (minimo padrao da fabrica) para produtos sem o campo. Os
  // presets derivam dela, mantendo a escada proporcional (500 -> 500/1k/3k/5k).
  const minQtd = produto.quantidadeMinima ?? 500;
  const presets = [minQtd, minQtd * 2, minQtd * 6, minQtd * 10];

  const [corNome, setCorNome] = useState(cores[0]?.nome ?? "");
  const [imgIdx, setImgIdx] = useState(0);
  // Foto da cor selecionada, quando a cor tem foto propria (cores[i].imagem); null
  // = a bolinha e so swatch e o palco segue a galeria (imgIdx).
  const [corImg, setCorImg] = useState<string | null>(cores[0]?.imagem ?? null);
  const [qtd, setQtd] = useState(minQtd);
  const [sbOn, setSbOn] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [videoOpen, setVideoOpen] = useState(false);
  const [dimOpen, setDimOpen] = useState(false);

  // Video da linha (YouTube): converte a URL de watch em embed. So aparece o
  // botao "Ver video" quando o produto tem videoUrl.
  const ytId = produto.videoUrl?.match(/[?&]v=([\w-]+)/)?.[1];
  const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : null;

  // Imagem de dimensoes (Payload: imagemDimensoes). So aparece o botao "Ver
  // dimensoes do produto" quando o produto tem a imagem cadastrada.
  const dimensoesSrc = imgSrc(produto.imagemDimensoes);

  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const qinRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const abaixoDoMinimo = qtd < minQtd;

  // Flags da estante (.fl): Novo (lancamento), Livre de BPA (selo/atoxidade),
  // Uso permanente e Reciclavel. Espelha o bloco .fl do produto() do mockup.
  const novo = (produto.destaques ?? []).includes("lancamento");
  const livreBpa =
    (produto.detalhe?.selos ?? []).some((s) => /bpa/i.test(s)) ||
    (produto.tags ?? []).some((t) => /bpa/i.test(t));

  const stageSrc = imgSrc(corImg ?? imagens[imgIdx]);
  const mainSrc = imgSrc(imagens[0]);
  // Hex da cor selecionada, para a bolinha do rotulo de cor que fica embaixo da
  // foto (.corcap). Deriva do nome (o state guarda o nome); cai na 1a cor se nao casar.
  const corHex = (cores.find((c) => c.nome === corNome) ?? cores[0])?.hex;
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

  // Fecha os modais (video / dimensoes) com Esc.
  useEffect(() => {
    if (!videoOpen && !dimOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVideoOpen(false);
        setDimOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [videoOpen, dimOpen]);

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
    setCorImg(null); // navegou na galeria: descarta a foto-de-cor e volta pra galeria
  }
  function escolherCor(i: number) {
    setCorNome(cores[i].nome);
    // So troca o palco quando a cor tem foto propria. Cor sem foto (ex. "Cristal"
    // transparente) so muda o nome e MANTEM o palco como esta (nao reseta pra foto 0).
    if (cores[i].imagem) setCorImg(cores[i].imagem);
  }

  function aoAdicionar() {
    if (abaixoDoMinimo) {
      qinRef.current?.focus();
      toast(`O pedido mínimo é de ${fmt(minQtd)} unidades`);
      return;
    }
    adicionar({
      produtoSlug: produto.slug,
      nome: produto.nome,
      cor: corNome,
      quantidade: qtd,
      imagem: corImg ?? imagens[imgIdx] ?? imagens[0],
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
            {imagens.map((src, i) => {
              // Pula entradas de imagem vazias/invalidas: nao renderiza a miniatura
              // vazia (o quadradinho branco que o Plinio marcou no fim da tira).
              // imgSrc("" / undefined) devolve string vazia.
              const thumbSrc = imgSrc(src);
              if (!thumbSrc) return null;
              return (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  // Destaca a miniatura cuja foto e a que esta no palco, seja por
                  // navegacao (imgIdx) ou pela foto da cor (corImg). Quando o backend
                  // alinhar imagens[]=cores[] e preencher cores[].imagem, clicar numa
                  // cor destaca a miniatura certa sozinho.
                  className={thumbSrc === stageSrc ? "on" : ""}
                  onClick={() => escolherThumb(i)}
                  aria-label={`Imagem ${i + 1}`}
                >
                  <img src={thumbSrc} alt="" />
                </button>
              );
            })}

            {/* Video como miniatura clicavel no fim da tira (item 2 da revisao do
                Plinio): so aparece quando o produto tem video (embedUrl). Usa a 1a
                foto do produto como fundo (ou um fundo neutro quando nao ha foto),
                com um icone de play sobreposto no centro. Clicar abre o mesmo modal
                de video do botao .vbtn. */}
            {embedUrl && (
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                aria-label="Ver vídeo"
                style={{ position: "relative", overflow: "hidden" }}
              >
                {mainSrc ? (
                  <img src={mainSrc} alt="" />
                ) : (
                  <span
                    style={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      background: "var(--g-card)",
                    }}
                  />
                )}
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,30,18,.28)",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 30,
                      height: 30,
                      fontSize: 15,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,.92)",
                      color: "var(--green)",
                      boxShadow: "var(--sh-1)",
                    }}
                  >
                    <Icon name="brand-youtube" />
                  </span>
                </span>
              </button>
            )}
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

          {/* Nome da cor em destaque, logo abaixo da foto (E2). Antes ficava so
              no rotulo pequeno do configurador, no canto; agora acompanha a imagem. */}
          {cores.length > 0 && (
            <div className="corcap" aria-live="polite">
              <span className="dot" style={{ background: corHex }} />
              <span className="k">Cor</span>
              <span className="v">{corNome}</span>
            </div>
          )}

          {/* Botao "Ver video" na area de midia, a esquerda, junto da galeria (E3,
              benchmark Amazon). Antes ficava espremido no configurador, a direita. */}
          {embedUrl && (
            <button type="button" className="vbtn" onClick={() => setVideoOpen(true)}>
              <Icon name="camera" />
              Ver vídeo do produto
            </button>
          )}

          {/* Botao "Ver dimensoes do produto" na mesma area de midia, junto da
              galeria (item C da revisao Plinio). So aparece quando o produto tem a
              imagem de dimensoes cadastrada; abre um modal com as cotas. */}
          {dimensoesSrc && (
            <button type="button" className="vbtn" onClick={() => setDimOpen(true)}>
              <Icon name="ruler-measure" />
              Ver dimensões do produto
            </button>
          )}
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
              `${produto.nome} personalizado com a sua logomarca, fabricado no Brasil. Pedidos a partir de ${fmt(minQtd)} unidades.`}
          </p>

          <div className="blk">
            {cores.length > 0 && (
              <div>
                <div className="lbl">Cor</div>
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
              <div className="lbl">
                Quantidade <span>mínimo {fmt(minQtd)} unidades</span>
              </div>
              <div className="seg">
                {presets.map((n) => (
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
                O pedido mínimo é de {fmt(minQtd)} unidades. Para volumes menores, fale com o
                especialista.
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

      {/* Modal de video (YouTube embed) */}
      {videoOpen && embedUrl && (
        <div
          className="vmodal"
          role="dialog"
          aria-modal="true"
          aria-label={`Vídeo: ${produto.nome}`}
          onClick={() => setVideoOpen(false)}
        >
          <div className="vbox" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="vclose"
              aria-label="Fechar vídeo"
              onClick={() => setVideoOpen(false)}
            >
              <Icon name="x" />
            </button>
            <div className="vframe">
              <iframe
                src={`${embedUrl}?autoplay=1&rel=0`}
                title={`Vídeo do produto ${produto.nome}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de dimensoes (imagem com as cotas do produto). Mesmo padrao visual
          do modal de video (.vmodal/.vbox/.vclose): fecha no Esc e no clique do
          fundo. A imagem usa object-fit:contain para caber sem distorcer. */}
      {dimOpen && dimensoesSrc && (
        <div
          className="vmodal"
          role="dialog"
          aria-modal="true"
          aria-label={`Dimensões do produto ${produto.nome}`}
          onClick={() => setDimOpen(false)}
        >
          <div className="vbox" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="vclose"
              aria-label="Fechar dimensões"
              onClick={() => setDimOpen(false)}
            >
              <Icon name="x" />
            </button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                borderRadius: 14,
                padding: 16,
                boxShadow: "var(--sh-2)",
              }}
            >
              <img
                src={dimensoesSrc}
                alt={`Dimensões do produto ${produto.nome}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Toast de confirmacao (espelha o toast() do mockup) */}
      <div className={`toast${toastMsg ? " on" : ""}`} role="status" aria-live="polite">
        <Icon name="circle-check" />
        <span>{toastMsg}</span>
      </div>
    </>
  );
}
