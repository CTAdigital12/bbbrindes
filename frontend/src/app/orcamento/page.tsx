"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { imgSrc } from "@/lib/asset";
import { WA } from "@/data/home-joy";
import { mascaraTelefone } from "@/lib/mask";
import Icon from "@/components/Icon";

// Pagina de orcamento espelhando a funcao orcamento() do mockup funcional da
// Joy, com as classes verbatim do design-system.css (.empty, .ptitle, .orc, .list, .oi,
// .step, .warn, .steps, .stp, .form, .fld, .row2, .secure). Carrinho de
// ORCAMENTO: sem preco nem pagamento. A quantidade usa passo de 100 (stepper) e
// o minimo B2B e 500 unidades (aviso quando abaixo). O envio faz POST em
// /api/orcamento (FB-7); so no sucesso salva o snapshot em "bbbrindes:ultimo-pedido",
// limpa o carrinho e vai para a confirmacao. Na falha mantem o carrinho e oferece
// o WhatsApp, para nao perder o lead.

const MIN_QTD = 500;
const PASSO = 100;
const fmt = (n: number) => n.toLocaleString("pt-BR");

// Base do backend (mesmo padrao de lib/payload.ts): em producao a var e inlinada
// no build pelo deploy.yml (Railway); sem ela, cai no localhost do dev.
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

type Form = { nome: string; empresa: string; telefone: string; email: string };
type Erros = Partial<Record<keyof Form, boolean>>;

// Passos "O que acontece depois" (steps() do mockup).
const PASSOS: [string, string][] = [
  ["Você envia", "O pedido chega ao time comercial com todos os itens."],
  ["Especialista retorna", "Com preço, prazo de produção e frete."],
  ["Você aprova a arte", "Layout com a sua marca antes da produção."],
  ["Produzimos e entregamos", "Na fábrica da BB, para todo o Brasil."],
];

export default function OrcamentoPage() {
  const { itens, alterarQuantidade, remover, limpar } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<Form>({ nome: "", empresa: "", telefone: "", email: "" });
  const [erros, setErros] = useState<Erros>({});
  const [consentimento, setConsentimento] = useState(false);
  const [erroConsent, setErroConsent] = useState(false);
  // Honeypot: campo escondido que humano nao preenche; se vier com valor, o
  // backend descarta sozinho. Fica no estado so para mandar no corpo.
  const [website, setWebsite] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  const total = itens.reduce((a, i) => a + i.quantidade, 0);

  function setCampo<K extends keyof Form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validar(): boolean {
    const e: Erros = {};
    if (!form.nome.trim()) e.nome = true;
    if (!form.empresa.trim()) e.empresa = true;
    if (!form.telefone.trim()) e.telefone = true;
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = true;
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    if (itens.length === 0 || enviando) return;
    const camposOk = validar();
    // LGPD obrigatorio: sem o aceite, bloqueia o envio e marca o checkbox.
    if (!consentimento) setErroConsent(true);
    if (!camposOk || !consentimento) return;

    setEnviando(true);
    setErroEnvio(null);
    // Manda os itens do carrinho como estao: o backend recalcula o total e
    // ignora campos extras do item (ex.: imagem). "website" e o honeypot.
    const corpo = { solicitante: form, itens, consentimento: true, website };

    try {
      const res = await fetch(`${BACKEND}/api/orcamento`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
      });
      const json: { ok?: boolean; erro?: string } | null = await res
        .json()
        .catch(() => null);

      if (res.ok && json?.ok) {
        // So no sucesso: snapshot pra tela de confirmacao, limpa e navega.
        const resumo = { solicitante: form, itens, total };
        window.localStorage.setItem("bbbrindes:ultimo-pedido", JSON.stringify(resumo));
        limpar();
        router.push("/orcamento/sucesso");
        return;
      }

      // Validacao (400), rate-limit (429) ou falha de entrega (502): mantem o
      // carrinho e mostra o erro com o caminho do WhatsApp.
      setErroEnvio(json?.erro || "Nao foi possivel enviar agora. Tente de novo em instantes.");
      setEnviando(false);
    } catch {
      // Erro de rede: mantem o carrinho e oferece o WhatsApp.
      setErroEnvio("Nao foi possivel enviar agora. Verifique a conexao ou fale no WhatsApp.");
      setEnviando(false);
    }
  }

  // ---------- Vazio ----------
  if (itens.length === 0) {
    return (
      <div className="wrap">
        <div className="ptitle">
          <h1>Meu orçamento</h1>
        </div>
        <div className="empty">
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#e8f0da",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 14px",
              color: "var(--deep)",
            }}
          >
            <Icon name="shopping-bag" className="big" />
          </div>
          <h3 style={{ margin: "0 0 6px", fontSize: 20 }}>Seu orçamento está vazio</h3>
          <p style={{ color: "var(--muted)", margin: "0 0 18px" }}>
            Escolha os brindes e as quantidades. O especialista retorna com a proposta.
          </p>
          <Link className="btn btn-cta btn-lg" href="/catalogo">
            Ir para o catálogo
            <Icon name="arrow-right" />
          </Link>
        </div>
      </div>
    );
  }

  // ---------- Com itens ----------
  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<span>Orçamento</span>
      </div>

      <div className="ptitle">
        <h1>Meu orçamento</h1>
        <p>
          {itens.length} {itens.length === 1 ? "produto" : "produtos"} · {fmt(total)} unidades.
          Revise as quantidades e envie: um especialista retorna com a proposta.
        </p>
      </div>

      <div className="orc">
        <div>
          <div className="list">
            {itens.map((it, k) => {
              const src = imgSrc(it.imagem);
              return (
                <div className="oi" key={`${it.produtoSlug}-${it.cor}`}>
                  <Link href={`/produto/${it.produtoSlug}`} aria-label={it.nome}>
                    {src ? (
                      <img src={src} alt="" />
                    ) : (
                      <span
                        style={{
                          display: "block",
                          width: 96,
                          height: 96,
                          borderRadius: 16,
                          background: "var(--g-card)",
                        }}
                      />
                    )}
                  </Link>
                  <div>
                    <b>{it.nome}</b>
                    <small>
                      {it.cor ? `Cor: ${it.cor} · ` : ""}personalização na proposta
                    </small>
                    {it.quantidade < MIN_QTD && (
                      <div className="warn on">Abaixo do mínimo de 500 unidades.</div>
                    )}
                  </div>
                  <div className="r">
                    <div className="step">
                      <button
                        type="button"
                        onClick={() => alterarQuantidade(k, Math.max(PASSO, it.quantidade - PASSO))}
                        aria-label="Menos"
                      >
                        <Icon name="minus" />
                      </button>
                      <input
                        value={it.quantidade}
                        inputMode="numeric"
                        onChange={(e) =>
                          alterarQuantidade(k, parseInt(e.target.value.replace(/\D/g, ""), 10) || 0)
                        }
                        aria-label="Quantidade"
                      />
                      <button
                        type="button"
                        onClick={() => alterarQuantidade(k, it.quantidade + PASSO)}
                        aria-label="Mais"
                      >
                        <Icon name="plus" />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="link"
                      onClick={() => remover(k)}
                      style={{ fontSize: 13, color: "var(--muted)" }}
                    >
                      <Icon name="trash" />
                      Remover
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Link className="link" href="/catalogo" style={{ marginTop: 14 }}>
            <Icon name="plus" />
            Adicionar mais produtos
          </Link>

          <section className="sec" style={{ paddingTop: 36 }}>
            <div className="shead">
              <div>
                <h2>O que acontece depois</h2>
              </div>
            </div>
            <div className="steps">
              {PASSOS.map((s, i) => (
                <div className="stp" key={s[0]}>
                  <i>{i + 1}</i>
                  <b>{s[0]}</b>
                  <span>{s[1]}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <form className="form" onSubmit={enviar} noValidate>
          <h3>Seus dados</h3>
          {/* Honeypot: fora do fluxo visual e do foco; humano nao enxerga nem
              preenche. Se vier com valor, o backend descarta o envio. */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: 0 }}>
            <label htmlFor="f-website">Nao preencha este campo</label>
            <input
              id="f-website"
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <Campo
            id="f-nome"
            label="Nome"
            autoComplete="name"
            maxLength={80}
            valor={form.nome}
            erro={erros.nome}
            onChange={(v) => setCampo("nome", v)}
          />
          <Campo
            id="f-empresa"
            label="Empresa"
            autoComplete="organization"
            maxLength={80}
            valor={form.empresa}
            erro={erros.empresa}
            onChange={(v) => setCampo("empresa", v)}
          />
          <div className="row2">
            <Campo
              id="f-email"
              label="E-mail corporativo"
              tipo="email"
              autoComplete="email"
              maxLength={120}
              valor={form.email}
              erro={erros.email}
              onChange={(v) => setCampo("email", v)}
            />
            <Campo
              id="f-tel"
              label="WhatsApp"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(00) 00000-0000"
              maxLength={15}
              mask={mascaraTelefone}
              valor={form.telefone}
              erro={erros.telefone}
              onChange={(v) => setCampo("telefone", v)}
            />
          </div>

          <label
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
              fontSize: 13,
              color: "var(--muted)",
              lineHeight: 1.45,
              margin: "4px 0 14px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={consentimento}
              aria-invalid={erroConsent || undefined}
              style={{ marginTop: 2, accentColor: "var(--deep)" }}
              onChange={(e) => {
                setConsentimento(e.target.checked);
                if (e.target.checked) setErroConsent(false);
              }}
            />
            <span>
              Li e aceito a{" "}
              <Link href="/politica-de-privacidade" style={{ textDecoration: "underline" }}>
                Política de Privacidade
              </Link>
              .
            </span>
          </label>
          {erroConsent && (
            <div className="warn on" role="alert">
              Para enviar, marque o aceite da Política de Privacidade.
            </div>
          )}

          <button type="submit" className="btn btn-cta btn-lg btn-block" disabled={enviando}>
            {enviando ? "Enviando…" : "Enviar pedido de orçamento"}
            {!enviando && <Icon name="arrow-right" />}
          </button>

          {erroEnvio && (
            <div className="warn on" role="alert" style={{ marginTop: 10 }}>
              {erroEnvio}{" "}
              <a
                href={WA}
                target="_blank"
                rel="noopener"
                style={{ fontWeight: 700, textDecoration: "underline" }}
              >
                Falar no WhatsApp
              </a>
            </div>
          )}

          <div className="secure">
            <Icon name="lock" />
            Seus dados vão só para o time comercial da BB Brindes.
          </div>
        </form>
      </div>
    </div>
  );
}

// Campo do formulario (.fld do mockup): label + input, marcando .err quando
// invalido. O [required] fica no input para o A11y, mas a validacao real roda no
// submit (noValidate), igual ao mockup.
function Campo({
  id,
  label,
  valor,
  erro,
  tipo = "text",
  inputMode,
  autoComplete,
  placeholder,
  maxLength,
  mask,
  onChange,
}: {
  id: string;
  label: string;
  valor: string;
  erro?: boolean;
  tipo?: string;
  inputMode?: "numeric" | "tel" | "text" | "email";
  autoComplete?: string;
  placeholder?: string;
  // Limite de caracteres do campo (evita input absurdo).
  maxLength?: number;
  // Formatador opcional aplicado a cada digitacao (ex.: mascara de telefone).
  mask?: (v: string) => string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="fld">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={tipo}
        value={valor}
        required
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        maxLength={maxLength}
        className={erro ? "err" : undefined}
        aria-invalid={erro || undefined}
        onChange={(e) => onChange(mask ? mask(e.target.value) : e.target.value)}
      />
    </div>
  );
}
