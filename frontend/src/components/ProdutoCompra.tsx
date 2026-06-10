"use client";

import Link from "next/link";
import { useState } from "react";
import type { Produto } from "@/lib/types";
import { useCart } from "@/lib/cart";

// Bloco interativo da PDP: escolher cor, quantidade e adicionar ao orcamento.
export default function ProdutoCompra({ produto }: { produto: Produto }) {
  const { adicionar } = useCart();
  const [cor, setCor] = useState(produto.cores[0]?.nome ?? "Unica");
  const [qtd, setQtd] = useState(1);
  const [adicionado, setAdicionado] = useState(false);

  function aoAdicionar() {
    adicionar({ produtoSlug: produto.slug, nome: produto.nome, cor, quantidade: qtd });
    setAdicionado(true);
  }

  return (
    <div className="space-y-5">
      {/* Cores */}
      {produto.cores.length > 0 && (
        <div>
          <span className="wf-label">Cor: {cor}</span>
          <div className="flex flex-wrap gap-2">
            {produto.cores.map((c) => (
              <button
                key={c.nome}
                type="button"
                onClick={() => setCor(c.nome)}
                title={c.nome}
                className={`h-8 w-8 rounded-full border-2 ${
                  cor === c.nome ? "border-wf-accent" : "border-wf-line"
                }`}
                style={{ backgroundColor: c.hex }}
                aria-label={`Selecionar cor ${c.nome}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quantidade */}
      <div>
        <span className="wf-label">Quantidade</span>
        <div className="inline-flex items-center">
          <button
            type="button"
            className="wf-btn-ghost rounded-r-none px-3"
            onClick={() => setQtd((q) => Math.max(1, q - 1))}
            aria-label="Diminuir"
          >
            -
          </button>
          <input
            type="number"
            min={1}
            value={qtd}
            onChange={(e) => setQtd(Math.max(1, Number(e.target.value) || 1))}
            className="wf-input w-20 rounded-none text-center"
          />
          <button
            type="button"
            className="wf-btn-ghost rounded-l-none px-3"
            onClick={() => setQtd((q) => q + 1)}
            aria-label="Aumentar"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={aoAdicionar} className="wf-btn-primary">
          Adicionar ao orcamento
        </button>
        {adicionado && (
          <Link href="/orcamento" className="wf-btn-ghost">
            Ir para o orcamento
          </Link>
        )}
      </div>

      {adicionado && (
        <p className="text-sm text-wf-accent">Adicionado ao orcamento.</p>
      )}

      <p className="text-xs text-wf-muted">
        Sem pagamento online. Voce monta o orcamento e um vendedor entra em contato.
      </p>
    </div>
  );
}
