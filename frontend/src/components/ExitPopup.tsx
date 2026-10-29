"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { useCart } from "@/lib/cart";
import { WA } from "@/data/home-joy";

// Popup de saida (exit-intent) + orcamento abandonado. Espelha o mockup da Joy
// (BB-Brindes_Mockup-Site, 28/10) = FB-5 da reuniao. Regras/envio ficam no backend
// (FB-7 Leads2b); aqui so a "cara" + o gatilho. Aparece 1x por sessao.
//  - gatilho desktop: mouse sai pela borda de cima (exit-intent);
//  - gatilho mobile (touch): 60s na pagina;
//  - com itens no orcamento: CTA fecha pelo WhatsApp com a lista montada;
//  - sem itens: opt-in curto (nome + e-mail) com consentimento LGPD.

const SESSION_KEY = "bb_pop";
const fmt = (n: number) => n.toLocaleString("pt-BR");

export default function ExitPopup() {
  const { itens } = useCart();
  const [aberto, setAberto] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const jaDisparou = useRef(false);

  function abrir() {
    if (jaDisparou.current) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        jaDisparou.current = true;
        return;
      }
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage indisponivel (ex. navegacao privada): mostra 1x por mount
    }
    jaDisparou.current = true;
    setAberto(true);
  }

  const fechar = () => setAberto(false);

  // Gatilhos: exit-intent (desktop) + fallback por tempo (mobile/touch).
  useEffect(() => {
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) abrir();
    };
    document.addEventListener("mouseout", onMouseOut);
    let t: ReturnType<typeof setTimeout> | undefined;
    if (window.matchMedia("(pointer:coarse)").matches) {
      t = setTimeout(abrir, 60000);
    }
    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      if (t) clearTimeout(t);
    };
  }, []);

  // Fecha no Esc quando aberto.
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aberto]);

  const temItens = itens.length > 0;
  const waCart =
    WA +
    "?text=" +
    encodeURIComponent(
      "Olá! Quero fechar este orçamento:\n" +
        itens
          .map((it) => `• ${it.nome} — ${fmt(it.quantidade)} un. (${it.cor})`)
          .join("\n"),
    );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setEnviado(true);
    setTimeout(fechar, 2200);
  }

  return (
    <>
      <div
        className={`scrim${aberto ? " on" : ""}`}
        onClick={fechar}
        aria-hidden="true"
      />
      <div
        className={`pop${aberto ? " on" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Aviso"
      >
        {enviado ? (
          <>
            <span className="eyebrow">Pronto</span>
            <h3>Recebemos seu contato</h3>
            <p>Em breve um especialista fala com você.</p>
          </>
        ) : temItens ? (
          <>
            <button className="xbtn" onClick={fechar} aria-label="Fechar">
              <Icon name="x" />
            </button>
            <span className="eyebrow">Seu orçamento ficou pela metade</span>
            <h3>Fechamos pelo WhatsApp?</h3>
            <p>
              Você montou {itens.length} {itens.length > 1 ? "itens" : "item"}. Um
              especialista recebe a lista e responde com a proposta.
            </p>
            <a
              className="btn btn-wa btn-lg btn-block"
              href={waCart}
              target="_blank"
              rel="noopener"
            >
              <Icon name="brand-whatsapp" />
              Enviar orçamento pelo WhatsApp
            </a>
          </>
        ) : (
          <>
            <button className="xbtn" onClick={fechar} aria-label="Fechar">
              <Icon name="x" />
            </button>
            <span className="eyebrow">Antes de sair</span>
            <h3>Receba o catálogo e as datas de produção do ano</h3>
            <p>
              Um especialista entra em contato só para ajudar com o seu próximo
              brinde.
            </p>
            <form onSubmit={onSubmit} noValidate>
              <div className="fld">
                <label>Nome</label>
                <input required />
              </div>
              <div className="fld">
                <label>E-mail corporativo</label>
                <input type="email" required />
              </div>
              <label className="lgpd">
                <input type="checkbox" required />
                <span>
                  Concordo em receber contato da BB Brindes e com a{" "}
                  <a href="#">Política de Privacidade</a> (LGPD).
                </span>
              </label>
              <button className="btn btn-deep btn-lg btn-block">
                Quero receber
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
