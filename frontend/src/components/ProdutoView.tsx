"use client";

import Link from "next/link";
import { useState } from "react";
import type { Produto } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { nomeCategoria } from "@/data/categorias";

// PDP revisada (S01-13): galeria com opcao de video, troca de cor muda a imagem
// exibida, sem "personalizavel" e "aplicacoes". Mantem descricao, categoria,
// cores, quantidade e adicionar ao orcamento.
export default function ProdutoView({ produto }: { produto: Produto }) {
  const { adicionar } = useCart();
  const temCores = produto.cores.length > 0;
  const [cor, setCor] = useState(produto.cores[0]?.nome ?? "Unica");
  const [qtd, setQtd] = useState(1);
  const [adicionado, setAdicionado] = useState(false);
  const [midia, setMidia] = useState<"imagem" | "video">("imagem");

  const corAtual = produto.cores.find((c) => c.nome === cor);

  function aoAdicionar() {
    adicionar({ produtoSlug: produto.slug, nome: produto.nome, cor, quantidade: qtd });
    setAdicionado(true);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Galeria: a imagem principal reflete a cor; ha um thumb de video */}
      <div className="space-y-3">
        <div
          className="relative aspect-square w-full overflow-hidden rounded-lg border border-wf-line"
          style={midia === "imagem" && corAtual ? { backgroundColor: corAtual.hex } : undefined}
        >
          {midia === "video" ? (
            <div className="flex h-full w-full items-center justify-center bg-wf-ink">
              <span className="text-sm font-medium text-white">Video do produto</span>
            </div>
          ) : (
            <div className={`flex h-full w-full items-end p-3 ${corAtual ? "" : "wf-img"}`}>
              <span className="rounded bg-wf-surface/90 px-2 py-1 text-xs font-medium text-wf-ink">
                {corAtual ? `Cor: ${corAtual.nome}` : "Imagem principal"}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setMidia("imagem")}
            className={`wf-img aspect-square rounded ${midia === "imagem" ? "ring-2 ring-wf-accent" : ""}`}
            aria-label="Ver imagem"
          >
            Imagem
          </button>
          <button
            type="button"
            onClick={() => setMidia("video")}
            className={`wf-img aspect-square rounded ${midia === "video" ? "ring-2 ring-wf-accent" : ""}`}
            aria-label="Ver video"
          >
            Video
          </button>
          <button
            type="button"
            onClick={() => setMidia("imagem")}
            className="wf-img aspect-square rounded"
            aria-label="Ver imagem"
          >
            Foto 2
          </button>
          <button
            type="button"
            onClick={() => setMidia("imagem")}
            className="wf-img aspect-square rounded"
            aria-label="Ver imagem"
          >
            Foto 3
          </button>
        </div>
      </div>

      {/* Informacoes e compra */}
      <div className="space-y-5">
        <div>
          <span className="text-xs text-wf-muted">{nomeCategoria(produto.categoria)}</span>
          <h1 className="text-2xl font-bold text-wf-ink">{produto.nome}</h1>
        </div>

        <p className="text-sm text-wf-text">{produto.descricao}</p>

        <dl className="text-sm">
          <dt className="text-wf-muted">Material</dt>
          <dd className="font-medium text-wf-ink">{produto.material}</dd>
        </dl>

        {temCores && (
          <div>
            <span className="wf-label">Cor: {cor}</span>
            <div className="flex flex-wrap gap-2">
              {produto.cores.map((c) => (
                <button
                  key={c.nome}
                  type="button"
                  onClick={() => {
                    setCor(c.nome);
                    setMidia("imagem");
                  }}
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

        {adicionado && <p className="text-sm text-wf-accent">Adicionado ao orcamento.</p>}

        <p className="text-xs text-wf-muted">
          Sem pagamento online. Voce monta o orcamento e um vendedor entra em contato.
        </p>
      </div>
    </div>
  );
}
