"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WA } from "@/data/home-joy";
import Icon from "@/components/Icon";

// Confirmacao de orcamento ("Cotacao recebida") espelhando a funcao done() do
// mockup funcional da Joy, com as classes verbatim do design-system.css (.done, .ok). O
// snapshot do ultimo pedido ("bbbrindes:ultimo-pedido") e opcional: se existir,
// mostramos um resumo discreto abaixo dos botoes (continuidade do wireframe).

type Resumo = {
  solicitante: { nome: string; empresa: string; telefone: string; email: string };
  itens: { nome: string; cor: string; quantidade: number }[];
  total: number;
};

const fmt = (n: number) => n.toLocaleString("pt-BR");

export default function SucessoPage() {
  const [resumo, setResumo] = useState<Resumo | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("bbbrindes:ultimo-pedido");
      if (raw) setResumo(JSON.parse(raw) as Resumo);
    } catch {
      // ignora snapshot corrompido
    }
  }, []);

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
          <a className="btn btn-wa" href={WA} target="_blank" rel="noopener">
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
                    {i.cor ? <span style={{ color: "var(--muted)" }}> · {i.cor}</span> : null}
                  </span>
                  <span style={{ whiteSpace: "nowrap" }}>{fmt(i.quantidade)} un.</span>
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
