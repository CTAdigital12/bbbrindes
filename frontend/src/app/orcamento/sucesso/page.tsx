"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WA } from "@/data/home-joy";
import { normalizarItem, coresDoItem, somaQtds, type ItemOrcamento } from "@/lib/cart";
import Icon from "@/components/Icon";

// Confirmacao de orcamento ("Cotacao recebida") espelhando a funcao done() do
// mockup funcional da Joy, com as classes verbatim do design-system.css (.done, .ok). O
// snapshot do ultimo pedido ("bbbrindes:ultimo-pedido") e opcional: se existir,
// mostramos um resumo discreto abaixo dos botoes (continuidade do wireframe).

type Resumo = {
  solicitante: { nome: string; empresa: string; telefone: string; email: string };
  itens: ItemOrcamento[];
  total: number;
};

const fmt = (n: number) => n.toLocaleString("pt-BR");
// Lista de quantidades de um item ("500 / 1.000"); vazia quando nao ha nenhuma.
const qtdsTexto = (it: ItemOrcamento) =>
  it.qtds.filter((n) => n > 0).map(fmt).join(" / ");

export default function SucessoPage() {
  const [resumo, setResumo] = useState<Resumo | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("bbbrindes:ultimo-pedido");
      if (!raw) return;
      // Migra o snapshot: itens no formato antigo ({cor, quantidade}) viram o novo
      // ({corBase, qtds}). Nunca quebra um snapshot ja salvo.
      const bruto = JSON.parse(raw) as {
        solicitante?: Resumo["solicitante"];
        itens?: unknown[];
        total?: number;
      };
      const itens = Array.isArray(bruto.itens)
        ? bruto.itens.map((i) => normalizarItem(i as Parameters<typeof normalizarItem>[0]))
        : [];
      const total =
        typeof bruto.total === "number"
          ? bruto.total
          : itens.reduce((a, i) => a + somaQtds(i.qtds), 0);
      setResumo({
        solicitante: bruto.solicitante ?? { nome: "", empresa: "", telefone: "", email: "" },
        itens,
        total,
      });
    } catch {
      // ignora snapshot corrompido
    }
  }, []);

  // Prefill do WhatsApp com o resumo do pedido (nome, empresa e itens). Este e o
  // caminho real de entrega do lead enquanto o CRM/n8n nao esta ligado, entao vale
  // adiantar o maximo. Sem snapshot, o link abre o WhatsApp sem texto.
  const waHref = resumo
    ? `${WA}?text=${encodeURIComponent(
        [
          "Olá! Acabei de enviar um pedido de orçamento pelo site.",
          "",
          `Nome: ${resumo.solicitante.nome}`,
          resumo.solicitante.empresa ? `Empresa: ${resumo.solicitante.empresa}` : "",
          "",
          "Itens:",
          ...resumo.itens.map((i) => {
            const cores = coresDoItem(i);
            return `• ${i.nome}${cores ? ` (${cores})` : ""}: ${qtdsTexto(i)} un.`;
          }),
        ]
          .filter(Boolean)
          .join("\n"),
      )}`
    : WA;

  return (
    <div className="wrap">
      <div className="done">
        <div className="ok">
          <Icon name="check" />
        </div>
        <h1>Cotação recebida</h1>
        <p style={{ color: "var(--muted)", margin: "0 0 22px" }}>
          Obrigado! Seu pedido de orçamento chegou ao time comercial da BB Brindes. Um especialista
          entra em contato pelo WhatsApp ou e-mail informado.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <a className="btn btn-wa" href={waHref} target="_blank" rel="noopener">
            <Icon name="brand-whatsapp" />
            Adiantar pelo WhatsApp
          </a>
          <Link className="btn btn-ghost" href="/">
            Voltar ao início
          </Link>
        </div>

        {resumo && (
          <div style={{ marginTop: 28, textAlign: "left" }}>
            <h2 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 600 }}>Resumo do pedido</h2>
            <p style={{ margin: 0, fontSize: 12.5, color: "var(--muted)" }}>
              {resumo.solicitante.nome}
              {resumo.solicitante.empresa ? ` · ${resumo.solicitante.empresa}` : ""}
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "12px 0 0",
                display: "grid",
                gap: 6,
              }}
            >
              {resumo.itens.map((i, idx) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    fontSize: 14,
                    borderBottom: "1px solid var(--line)",
                    paddingBottom: 6,
                  }}
                >
                  <span>
                    {i.nome}
                    {coresDoItem(i) ? (
                      <span style={{ color: "var(--muted)" }}> · {coresDoItem(i)}</span>
                    ) : null}
                  </span>
                  <span style={{ whiteSpace: "nowrap" }}>{qtdsTexto(i)} un.</span>
                </li>
              ))}
            </ul>
            <p style={{ margin: "10px 0 0", textAlign: "right", fontSize: 12.5, color: "var(--muted)" }}>
              {fmt(resumo.total)} unidades no total
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
