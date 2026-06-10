"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Resumo = {
  solicitante: { nome: string; empresa: string; telefone: string; email: string };
  itens: { nome: string; cor: string; quantidade: number }[];
  total: number;
};

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMERO ?? "5571999999999";

export default function SucessoPage() {
  const [resumo, setResumo] = useState<Resumo | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("bbbrindes:ultimo-pedido");
      if (raw) setResumo(JSON.parse(raw) as Resumo);
    } catch {
      // ignora
    }
  }, []);

  const msg = encodeURIComponent(
    "Ola! Acabei de enviar um pedido de orcamento pelo site e gostaria de falar com urgencia.",
  );

  return (
    <div className="wf-container py-12">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-wf-accent text-2xl text-white">
          OK
        </div>
        <h1 className="text-2xl font-bold text-wf-ink">Pedido de orcamento enviado</h1>
        <p className="mt-2 text-sm text-wf-text">
          Recebemos seu pedido. Um vendedor entra em contato em breve. Voce tambem recebera um email
          de confirmacao (na producao).
        </p>

        <a
          href={`https://wa.me/${WHATSAPP}?text=${msg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="wf-btn-primary mt-6"
        >
          Fale com urgencia no WhatsApp
        </a>

        {resumo && (
          <div className="wf-card mt-8 p-4 text-left">
            <h2 className="mb-2 text-sm font-semibold text-wf-ink">Resumo do pedido</h2>
            <p className="text-xs text-wf-muted">
              {resumo.solicitante.nome} - {resumo.solicitante.empresa}
            </p>
            <ul className="mt-3 space-y-1 text-sm text-wf-text">
              {resumo.itens.map((i, idx) => (
                <li key={idx} className="flex justify-between border-b border-wf-line py-1">
                  <span>
                    {i.nome} <span className="text-wf-muted">({i.cor})</span>
                  </span>
                  <span>{i.quantidade} un</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-right text-xs text-wf-muted">{resumo.total} itens no total</p>
          </div>
        )}

        <div className="mt-8">
          <Link href="/catalogo" className="wf-btn-ghost">
            Voltar ao catalogo
          </Link>
        </div>
      </div>
    </div>
  );
}
