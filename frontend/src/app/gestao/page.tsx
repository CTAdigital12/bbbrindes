"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nomeCategoria } from "@/data/categorias";
import { produtos } from "@/data/produtos";
import { listarManuais, removerManual, type ProdutoManual } from "@/lib/lojista";

type Linha = {
  id: string;
  nome: string;
  categoria: string;
  origem: "Importado" | "Manual";
};

export default function GestaoPage() {
  const [manuais, setManuais] = useState<ProdutoManual[]>([]);

  useEffect(() => {
    setManuais(listarManuais());
  }, []);

  function remover(id: string) {
    removerManual(id);
    setManuais(listarManuais());
  }

  // Catalogo importado (mock) + produtos manuais do lojista, num so lugar.
  const importados: Linha[] = produtos.map((p) => ({
    id: p.slug,
    nome: p.nome,
    categoria: p.categoria,
    origem: "Importado",
  }));

  return (
    <div className="bg-wf-bg">
      {/* Cabecalho distinto (area logada do lojista) */}
      <div className="border-b border-wf-line bg-wf-ink text-white">
        <div className="wf-container flex flex-wrap items-center justify-between gap-2 py-3">
          <div>
            <span className="text-xs uppercase tracking-wide text-wf-muted">Area do lojista</span>
            <h1 className="text-lg font-semibold">Gestao de produtos</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/gestao/novo" className="wf-btn-primary">
              Adicionar produto
            </Link>
            <Link href="/" className="wf-btn-ghost text-wf-ink">
              Sair
            </Link>
          </div>
        </div>
      </div>

      <div className="wf-container py-6">
        <div className="wf-card mb-4 p-4 text-sm text-wf-text">
          Aqui convivem os produtos vindos do catalogo da empresa (Importado) e os que voce
          adiciona manualmente (Manual). Uma nova importacao nunca apaga os produtos manuais.
          (Wireframe: dados de exemplo, sem backend.)
        </div>

        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-wf-ink">
            Produtos ({importados.length + manuais.length})
          </h2>
          <span className="text-xs text-wf-muted">
            {manuais.length} manual(is), {importados.length} importado(s)
          </span>
        </div>

        <div className="wf-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-wf-bg text-left text-xs uppercase text-wf-muted">
              <tr>
                <th className="p-3">Produto</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Origem</th>
                <th className="p-3 text-right">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {/* Manuais primeiro, com acoes de editar/remover */}
              {manuais.map((p) => (
                <tr key={p.id} className="border-t border-wf-line">
                  <td className="p-3 font-medium text-wf-ink">{p.nome}</td>
                  <td className="p-3">{nomeCategoria(p.categoria)}</td>
                  <td className="p-3">
                    <span className="wf-chip border-wf-accent text-wf-accent">Manual</span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="mr-3 cursor-default text-xs text-wf-muted">Editar</span>
                    <button
                      type="button"
                      onClick={() => remover(p.id)}
                      className="text-xs text-wf-muted hover:text-wf-accent"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}

              {importados.map((p) => (
                <tr key={p.id} className="border-t border-wf-line">
                  <td className="p-3 font-medium text-wf-ink">{p.nome}</td>
                  <td className="p-3">{nomeCategoria(p.categoria)}</td>
                  <td className="p-3">
                    <span className="wf-chip">Importado</span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="cursor-default text-xs text-wf-muted">Gerenciado pelo import</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
