"use client";

/* eslint-disable @next/next/no-img-element */

import { type CSSProperties, type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
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
// (.pd, .gal, .thumbs, .stage, .ring, .fl, .pinfo, .sub, .blk, .colors, .step,
// .warn, .buy#buyrow, .assure, .sticky-buy#sbuy). Dado REAL do Payload
// (getProdutoBySlug); cores e imagens de produto.cores / produto.imagens.
//
// Reuniao Joy 25/11 (task 9910008): cabecalho com codigo do site, DOIS seletores
// de cor (base x acessorio), TRES campos de quantidade, sem personalizacao publica,
// e carrossel sem modal (dimensoes e video viram slides da mesma galeria).

const fmt = (n: number) => n.toLocaleString("pt-BR");

// Colunas da grade compacta de swatches (espelha o calculo do mock: ate ~13 por
// linha, equilibrando as linhas quando ha muitas cores).
const gridCols = (n: number) => (n > 9 ? Math.ceil(n / Math.ceil(n / 13)) : n);

// Slide do carrossel da PDP. A galeria entra nesta ordem: fotos (das cores)
// primeiro, depois ambientada, depois dimensoes, depois o video por ultimo.
type Slide =
  | { tipo: "foto"; src: string }
  | { tipo: "ambientada"; src: string }
  | { tipo: "dimensoes"; src: string }
  | { tipo: "video"; embedUrl: string; posterSrc: string };

const SELO_SLIDE: Partial<Record<Slide["tipo"], string>> = {
  ambientada: "Ambiente",
  dimensoes: "Medidas",
  video: "Vídeo",
};

export default function ProdutoView({ produto }: { produto: Produto }) {
  const { adicionar } = useCart();
  const { abrir } = useCartUI();
  const nomeCategoria = useNomeCategoria();

  const imagens = useMemo(() => produto.imagens ?? [], [produto.imagens]);

  // Bloco BASE = produto.cores (nao migra). Bloco ACESSORIO = variacao.acessorio
  // do backend; so aparece quando esta ligado (naoPreencher = false) E tem cores.
  // Em PROD a maioria vem sem acessorio (o editor de 2 blocos ainda nao mergeou):
  // nesse caso a PDP mostra 1 seletor.
  const baseCores = useMemo(() => produto.cores ?? [], [produto.cores]);
  const baseNaoPreencher = produto.variacao?.base?.naoPreencher ?? false;
  const rotuloBase = produto.variacao?.base?.rotulo || "Cor";
  const acessorioBloco = produto.variacao?.acessorio;
  const acessorioCores = acessorioBloco?.cores ?? [];
  const temAcessorio = !!acessorioBloco && !acessorioBloco.naoPreencher && acessorioCores.length > 0;
  const rotuloAcessorio = acessorioBloco?.rotulo || "Cor";

  // Quantidade minima do pedido: vem do Payload por produto (quantidadeMinima),
  // com fallback em 500 (minimo padrao da fabrica) para produtos sem o campo.
  const minQtd = produto.quantidadeMinima ?? 500;

  // Video da linha (YouTube): converte a URL de watch em embed.
  const ytId = produto.videoUrl?.match(/[?&]v=([\w-]+)/)?.[1];
  const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : null;

  // Monta o carrossel unico (ordem da Joy): fotos das cores primeiro, depois as
  // demais fotos da galeria, depois ambientada, dimensoes e o video por ultimo.
  // Tudo deduplicado por src. As fotos de cor (cores[].imagem) vem de um upload
  // diferente de `imagens`, por isso entram explicitamente (e preservam a troca
  // de foto ao clicar na cor: cada cor com foto vira um slide do carrossel).
  const slides = useMemo<Slide[]>(() => {
    const out: Slide[] = [];
    const vistos = new Set<string>();
    const addFoto = (raw?: string) => {
      const r = imgSrc(raw);
      if (r && !vistos.has(r)) {
        vistos.add(r);
        out.push({ tipo: "foto", src: r });
      }
    };
    for (const c of baseCores) addFoto(c.imagem);
    for (const src of imagens) addFoto(src);
    const amb = imgSrc(produto.imagemAmbientada);
    if (amb && !vistos.has(amb)) {
      vistos.add(amb);
      out.push({ tipo: "ambientada", src: amb });
    }
    const dim = imgSrc(produto.imagemDimensoes);
    if (dim && !vistos.has(dim)) {
      vistos.add(dim);
      out.push({ tipo: "dimensoes", src: dim });
    }
    const primeiraFoto = out.find((s) => s.tipo === "foto");
    if (embedUrl) {
      out.push({
        tipo: "video",
        embedUrl,
        posterSrc: primeiraFoto && primeiraFoto.tipo === "foto" ? primeiraFoto.src : "",
      });
    }
    return out;
  }, [baseCores, imagens, produto.imagemAmbientada, produto.imagemDimensoes, embedUrl]);

  // Mapa src-da-foto -> nome da cor base, para clicar numa cor navegar ate o
  // slide daquela cor (quando a cor tem foto propria em cores[].imagem).
  const slideDaCorBase = useMemo(() => {
    const m = new Map<string, number>();
    baseCores.forEach((c) => {
      const cs = imgSrc(c.imagem);
      if (!cs) return;
      const idx = slides.findIndex((s) => s.tipo === "foto" && s.src === cs);
      if (idx >= 0) m.set(c.nome, idx);
    });
    return m;
  }, [baseCores, slides]);

  const [corBaseNome, setCorBaseNome] = useState(baseCores[0]?.nome ?? "");
  const [corAcessorioNome, setCorAcessorioNome] = useState(acessorioCores[0]?.nome ?? "");
  const [slideIdx, setSlideIdx] = useState(0);
  // Quantidades como strings para suportar campos opcionais vazios e a formatacao
  // de milhar ao sair do campo. A 1a inicia com o minimo; as outras vazias.
  const [qtdsStr, setQtdsStr] = useState<string[]>([fmt(minQtd), "", ""]);
  const [erroQtd, setErroQtd] = useState<boolean[]>([false, false, false]);
  const [sbOn, setSbOn] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const qinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Quantidades numericas derivadas das strings (digitos apenas).
  const qtdsNum = qtdsStr.map((s) => parseInt(s.replace(/\D/g, ""), 10) || 0);
  // Avisa quando a 1a esta abaixo do minimo, ou quando alguma opcional preenchida
  // ficou abaixo do minimo.
  const abaixoDoMinimo =
    qtdsNum[0] < minQtd || qtdsNum.slice(1).some((n) => n > 0 && n < minQtd);

  const slideAtual = slides[slideIdx];
  // Classe do palco por tipo de slide (espelha o data-t do mock).
  const stageTipoClass =
    slideAtual?.tipo === "video"
      ? " vid"
      : slideAtual?.tipo === "ambientada"
        ? " amb"
        : slideAtual?.tipo === "dimensoes"
          ? " dim"
          : "";
  const seloAtual = slideAtual ? SELO_SLIDE[slideAtual.tipo] : undefined;

  // Flags da estante (.fl): Novo (lancamento), Livre de BPA (selo/atoxidade),
  // Uso permanente e Reciclavel. Espelha o bloco .fl do produto() do mockup.
  const novo = (produto.destaques ?? []).includes("lancamento");
  const livreBpa =
    (produto.detalhe?.selos ?? []).some((s) => /bpa/i.test(s)) ||
    (produto.tags ?? []).some((t) => /bpa/i.test(t));

  const mainSrc = slides.find((s) => s.tipo === "foto")?.src ?? "";
  const corHex = (baseCores.find((c) => c.nome === corBaseNome) ?? baseCores[0])?.hex;
  const waText = `${WA}?text=${encodeURIComponent("Olá! Quero um orçamento de " + produto.nome)}`;

  const temDimensoes = slides.some((s) => s.tipo === "dimensoes");

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
  // mockup. Nao aplica em slide de video. Mexe direto no style do <img> via ref.
  function aoMover(e: MouseEvent<HTMLDivElement>) {
    // Zoom so nas fotos de produto (ambientada/dimensoes/video nao ampliam, como no mock).
    if (slideAtual?.tipo !== "foto") return;
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

  // Navega ate um slide (dimensoes/video) no mesmo carrossel; no mobile leva o
  // palco a vista. Substitui os modais antigos.
  function irParaSlide(pred: (s: Slide) => boolean) {
    const idx = slides.findIndex(pred);
    if (idx < 0) return;
    setSlideIdx(idx);
    stageRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Setas do carrossel: anda um slide para tras/frente (circular), como no mock.
  function passoSlide(d: number) {
    if (slides.length < 2) return;
    setSlideIdx((i) => (i + d + slides.length) % slides.length);
  }

  function escolherCorBase(i: number) {
    const nome = baseCores[i].nome;
    setCorBaseNome(nome);
    // Clicar numa cor com foto propria navega ate o slide daquela cor no carrossel.
    const idx = slideDaCorBase.get(nome);
    if (typeof idx === "number") setSlideIdx(idx);
  }

  function setSlotDigitos(slot: number, v: string) {
    setQtdsStr((a) => a.map((x, i) => (i === slot ? v.replace(/\D/g, "") : x)));
  }
  function aoFocarSlot(slot: number) {
    // Tira a formatacao enquanto edita (so digitos).
    setQtdsStr((a) => a.map((x, i) => (i === slot ? x.replace(/\D/g, "") : x)));
  }
  function aoSairSlot(slot: number) {
    // Formata o milhar ao sair do campo.
    setQtdsStr((a) =>
      a.map((x, i) => {
        if (i !== slot) return x;
        const n = parseInt(x.replace(/\D/g, ""), 10);
        return Number.isFinite(n) && n > 0 ? fmt(n) : "";
      }),
    );
  }

  function aoAdicionar() {
    // 1o obrigatorio e >= minimo; 2o/3o opcionais mas, se preenchidos, >= minimo.
    const erros = qtdsNum.map((n, i) =>
      i === 0 ? n < minQtd : n > 0 && n < minQtd,
    );
    if (erros.some(Boolean)) {
      setErroQtd(erros);
      const primeiro = erros.findIndex(Boolean);
      qinRefs.current[primeiro]?.focus();
      toast(`O pedido mínimo é de ${fmt(minQtd)} unidades`);
      return;
    }
    setErroQtd([false, false, false]);

    const qtds = qtdsNum.filter((n) => n >= minQtd);
    const corSel = baseCores.find((c) => c.nome === corBaseNome);
    adicionar({
      produtoSlug: produto.slug,
      nome: produto.nome,
      corBase: corBaseNome || undefined,
      corAcessorio: temAcessorio ? corAcessorioNome || undefined : undefined,
      rotuloBase: produto.variacao?.base?.rotulo || undefined,
      rotuloAcessorio: temAcessorio ? acessorioBloco?.rotulo || undefined : undefined,
      qtds,
      // imagem crua (o display resolve via imgSrc): foto da cor escolhida ou a 1a.
      imagem: corSel?.imagem || imagens[0],
      codigoSite: produto.codigoSite,
    });
    abrir();
    toast("Adicionado ao orçamento");
  }

  // Resumo de cor para a barra fixa (base + acessorio).
  const corSticky = [corBaseNome, temAcessorio ? corAcessorioNome : ""].filter(Boolean).join(" · ");
  const qtdSticky = qtdsNum[0] || minQtd;

  return (
    <>
      <div className="pd">
        {/* Galeria: coluna de miniaturas + palco com zoom (carrossel unico) */}
        <div className="gal">
          <div className="thumbs">
            {slides.map((s, i) => {
              const thumbSrc = s.tipo === "video" ? s.posterSrc : s.src;
              const selo = SELO_SLIDE[s.tipo];
              return (
                <button
                  key={`${s.tipo}-${i}`}
                  type="button"
                  className={i === slideIdx ? "on" : ""}
                  onClick={() => setSlideIdx(i)}
                  aria-label={selo ? `${selo} (slide ${i + 1})` : `Imagem ${i + 1}`}
                >
                  {thumbSrc ? (
                    <img src={thumbSrc} alt="" />
                  ) : (
                    <span
                      style={{ display: "block", width: "100%", height: "100%", background: "var(--g-card)" }}
                    />
                  )}
                  {s.tipo === "video" && (
                    <span className="thplay" aria-hidden="true">
                      <Icon name="video" />
                    </span>
                  )}
                  {selo && <span className="thsel">{selo}</span>}
                </button>
              );
            })}
          </div>

          <div
            className={`stage${stageTipoClass}`}
            id="stage"
            ref={stageRef}
            onMouseMove={aoMover}
            onMouseLeave={aoSair}
          >
            <span className="halo" />
            {slideAtual?.tipo === "video" ? (
              <div className="stage-video">
                <iframe
                  src={`${slideAtual.embedUrl}?rel=0`}
                  title={`Vídeo do produto ${produto.nome}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : slideAtual ? (
              <img id="mimg" ref={imgRef} src={slideAtual.src} alt={produto.nome} />
            ) : null}
            <div className="fl">
              {novo && <span className="chip chip-orange">Novo</span>}
              {livreBpa && <span className="chip chip-sage">Livre de BPA</span>}
              <span className="chip chip-sage">Uso permanente</span>
              <span className="chip chip-sage">Reciclável</span>
            </div>

            {/* Setas + contador do carrossel (sobre o palco, aparecem no hover). */}
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  className="gar l"
                  onClick={() => passoSlide(-1)}
                  aria-label="Imagem anterior"
                >
                  <Icon name="chevron-left" />
                </button>
                <button
                  type="button"
                  className="gar r"
                  onClick={() => passoSlide(1)}
                  aria-label="Próxima imagem"
                >
                  <Icon name="chevron-right" />
                </button>
                <span className="gcnt">
                  {slideIdx + 1}/{slides.length}
                </span>
              </>
            )}
            {/* Legenda do slide (Ambiente/Medidas/Vídeo); vazia nas fotos. */}
            {seloAtual && <span className="gcap">{seloAtual}</span>}
          </div>

          {/* Nome da cor base em destaque, logo abaixo da foto (E2). */}
          {baseCores.length > 0 && (
            <div className="corcap" aria-live="polite">
              <span className="dot" style={{ background: corHex }} />
              <span className="k">{rotuloBase}</span>
              <span className="v">{corBaseNome}</span>
            </div>
          )}

          {/* Botoes de midia: navegam ate o slide certo no MESMO carrossel (sem modal). */}
          {temDimensoes && (
            <button
              type="button"
              className="vbtn"
              onClick={() => irParaSlide((s) => s.tipo === "dimensoes")}
            >
              <Icon name="ruler-measure" />
              Ver dimensões do produto
            </button>
          )}
          {embedUrl && (
            <button
              type="button"
              className="vbtn"
              onClick={() => irParaSlide((s) => s.tipo === "video")}
            >
              <Icon name="video" />
              Ver vídeo do produto
            </button>
          )}
        </div>

        {/* Informacoes + configurador */}
        <div className="pinfo">
          {/* Cabecalho: categoria -> codigo do site -> nome (grid vertical .ptop). */}
          <div className="ptop">
            <Link className="cat" href={`/catalogo?categoria=${produto.categoria}`}>
              {nomeCategoria(produto.categoria)}
            </Link>
            {produto.codigoSite && <span className="pcod">Cód. {produto.codigoSite}</span>}
            <h1>{nb(produto.nome)}</h1>
          </div>
          <p className="sub">
            {produto.detalhe?.linhaCurta ||
              produto.descricao ||
              `${produto.nome} personalizado com a sua logomarca, fabricado no Brasil. Pedidos a partir de ${fmt(minQtd)} unidades.`}
          </p>

          <div className="blk">
            {/* Seletor de cor BASE */}
            {baseCores.length > 0 && !baseNaoPreencher && (
              <div>
                <div className="lbl">
                  <span className="cn">
                    {rotuloBase}
                    {corBaseNome ? (
                      <>
                        : <b>{corBaseNome}</b>
                      </>
                    ) : null}
                  </span>
                  {baseCores.length > 1 && <span>{baseCores.length} cores</span>}
                </div>
                <div
                  className={`colors${baseCores.length > 9 ? " sm" : ""}`}
                  style={{ "--cols": gridCols(baseCores.length) } as CSSProperties}
                >
                  {baseCores.map((c, i) => (
                    <button
                      key={c.nome}
                      type="button"
                      className={c.nome === corBaseNome ? "on" : ""}
                      style={{ background: c.hex }}
                      onClick={() => escolherCorBase(i)}
                      aria-label={c.nome}
                      aria-pressed={c.nome === corBaseNome}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Seletor de cor ACESSORIO (so quando ligado e com cores) */}
            {temAcessorio && (
              <div>
                <div className="lbl">
                  <span className="cn">
                    {rotuloAcessorio}
                    {corAcessorioNome ? (
                      <>
                        : <b>{corAcessorioNome}</b>
                      </>
                    ) : null}
                  </span>
                  {acessorioCores.length > 1 && <span>{acessorioCores.length} cores</span>}
                </div>
                <div
                  className={`colors${acessorioCores.length > 9 ? " sm" : ""}`}
                  style={{ "--cols": gridCols(acessorioCores.length) } as CSSProperties}
                >
                  {acessorioCores.map((c) => (
                    <button
                      key={c.nome}
                      type="button"
                      className={c.nome === corAcessorioNome ? "on" : ""}
                      style={{ background: c.hex }}
                      onClick={() => setCorAcessorioNome(c.nome)}
                      aria-label={c.nome}
                      aria-pressed={c.nome === corAcessorioNome}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantidade: 3 campos (1 obrigatorio + 2 opcionais), cada >= minimo. */}
            <div>
              <div className="lbl">
                Quantidade <span>mínimo {fmt(minQtd)} unidades</span>
              </div>
              <div className="qtys">
                {[0, 1, 2].map((slot) => (
                  <input
                    key={slot}
                    ref={(el) => {
                      qinRefs.current[slot] = el;
                    }}
                    className={erroQtd[slot] ? "err" : undefined}
                    inputMode="numeric"
                    value={qtdsStr[slot]}
                    placeholder={slot === 0 ? fmt(minQtd) : "Opcional"}
                    onChange={(e) => setSlotDigitos(slot, e.target.value)}
                    onFocus={() => aoFocarSlot(slot)}
                    onBlur={() => aoSairSlot(slot)}
                    aria-label={
                      slot === 0 ? "Quantidade (obrigatória)" : `Quantidade opcional ${slot + 1}`
                    }
                  />
                ))}
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
              {fmt(qtdSticky)} unidades{corSticky ? ` · ${corSticky}` : ""}
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
