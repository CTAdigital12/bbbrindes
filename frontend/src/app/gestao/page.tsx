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

// Pagina sem equivalente no mockup: so reaplica o tema Joy. Logica (manuais do
// localStorage + catalogo importado, remover) mantida intacta.
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
    <div className="bg-joy-paper">
      {/* Cabecalho distinto (area logada do lojista) */}
      <div className="bg-joy-deep text-white">
        <div className="wrap flex flex-wrap items-center justify-between gap-2 py-4">
          <div>
            <span className="text-xs uppercase tracking-wide text-white/60">
              Administração do site
            </span>
            <h1 className="text-lg font-semibold">Produtos e SKUs</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/gestao/novo" className="btn btn-cta btn-sm">
              Adicionar produto
            </Link>
            <Link href="/" className="btn btn-ghost-w btn-sm">
              Sair
            </Link>
          </div>
        </div>
      </div>

      <div className="wrap py-6">
        <div className="mb-4 rounded-joy-sm bg-white p-4 text-sm text-[#3e5148] shadow-joy1">
          Cadastro dos produtos e SKUs do site. Convivem os produtos vindos do catálogo da empresa
          (Importado) e os cadastrados aqui (Manual). Uma nova importação nunca apaga os produtos
          manuais. (Wireframe: dados de exemplo, sem backend.)
        </div>

        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-joy-ink">
            Produtos ({importados.length + manuais.length})
          </h2>
          <span className="text-xs text-joy-muted">
            {manuais.length} manual(is), {importados.length} importado(s)
          </span>
        </div>

        <div className="overflow-x-auto rounded-joy-sm bg-white shadow-joy1">
          <table className="w-full text-sm">
            <thead className="bg-joy-paper text-left text-xs uppercase text-joy-muted">
              <tr>
                <th className="p-3">Produto</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Origem</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {/* Manuais primeiro, com acoes de editar/remover */}
              {manuais.map((p) => (
                <tr key={p.id} className="border-t border-joy-line">
                  <td className="p-3 font-medium text-joy-ink">{p.nome}</td>
                  <td className="p-3">{nomeCategoria(p.categoria)}</td>
                  <td className="p-3">
                    <span className="chip chip-orange">Manual</span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="mr-3 cursor-default text-xs text-joy-muted">Editar</span>
                    <button
                      type="button"
                      onClick={() => remover(p.id)}
                      className="text-xs text-joy-muted hover:text-joy-deep"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}

              {importados.map((p) => (
                <tr key={p.id} className="border-t border-joy-line">
                  <td className="p-3 font-medium text-joy-ink">{p.nome}</td>
                  <td className="p-3">{nomeCategoria(p.categoria)}</td>
                  <td className="p-3">
                    <span className="chip">Importado</span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="cursor-default text-xs text-joy-muted">
                      Gerenciado pelo import
                    </span>
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
