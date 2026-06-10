"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { produtos } from "@/data/produtos";
import {
  historicoRevendedor,
  precoRevendedor,
  revendedorMock,
  tabelaRevendedor,
} from "@/data/revendedor";

type Aba = "tabela" | "pedido" | "historico" | "cadastro" | "arquivos";

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const statusLabel: Record<string, string> = {
  "em-analise": "Em analise",
  confirmado: "Confirmado",
  faturado: "Faturado",
};

export default function PainelRevendedorPage() {
  const [aba, setAba] = useState<Aba>("tabela");
  const [pedido, setPedido] = useState<Record<string, number>>({});

  const itensPedido = useMemo(
    () => Object.entries(pedido).filter(([, q]) => q > 0),
    [pedido],
  );
  const totalPedido = itensPedido.reduce((acc, [slug, q]) => {
    return acc + (precoRevendedor(slug)?.precoUnitario ?? 0) * q;
  }, 0);

  function addPedido(slug: string) {
    setPedido((p) => ({ ...p, [slug]: (p[slug] ?? 0) + 1 }));
  }
  function setQtd(slug: string, q: number) {
    setPedido((p) => ({ ...p, [slug]: Math.max(0, q) }));
  }

  return (
    <div className="bg-wf-bg">
      {/* Cabecalho distinto do B2B */}
      <div className="border-b border-wf-line bg-wf-ink text-white">
        <div className="wf-container flex flex-wrap items-center justify-between gap-2 py-3">
          <div>
            <span className="text-xs uppercase tracking-wide text-wf-muted">Area do revendedor</span>
            <h1 className="text-lg font-semibold">{revendedorMock.empresa}</h1>
          </div>
          <Link href="/" className="wf-btn-ghost text-wf-ink">
            Sair
          </Link>
        </div>
      </div>

      {/* Abas */}
      <div className="border-b border-wf-line bg-wf-surface">
        <div className="wf-container flex gap-1 overflow-x-auto">
          {(
            [
              ["tabela", "Precos e estoque"],
              ["pedido", `Pedido (${itensPedido.length})`],
              ["historico", "Historico"],
              ["cadastro", "Cadastro e entrega"],
              ["arquivos", "Arquivos e notas"],
            ] as [Aba, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setAba(id)}
              className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm ${
                aba === id ? "border-wf-accent font-medium text-wf-ink" : "border-transparent text-wf-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="wf-container py-6">
        {aba === "tabela" && (
          <div className="wf-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-wf-bg text-left text-xs uppercase text-wf-muted">
                <tr>
                  <th className="p-3">Produto</th>
                  <th className="p-3">Preco unit.</th>
                  <th className="p-3">Estoque</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((p) => {
                  const tr = tabelaRevendedor.find((t) => t.produtoSlug === p.slug);
                  return (
                    <tr key={p.slug} className="border-t border-wf-line">
                      <td className="p-3 font-medium text-wf-ink">{p.nome}</td>
                      <td className="p-3">{brl(tr?.precoUnitario ?? 0)}</td>
                      <td className="p-3">
                        <span className={tr && tr.estoque < 100 ? "text-red-600" : "text-wf-text"}>
                          {tr?.estoque ?? 0} un
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button type="button" onClick={() => addPedido(p.slug)} className="wf-btn-ghost">
                          Adicionar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {aba === "pedido" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="wf-card divide-y divide-wf-line">
              {itensPedido.length === 0 ? (
                <p className="p-6 text-sm text-wf-muted">
                  Nenhum item no pedido. Adicione na aba Precos e estoque.
                </p>
              ) : (
                itensPedido.map(([slug, q]) => {
                  const prod = produtos.find((p) => p.slug === slug);
                  const preco = precoRevendedor(slug)?.precoUnitario ?? 0;
                  return (
                    <div key={slug} className="flex items-center gap-3 p-3">
                      <div className="flex-1 text-sm font-medium text-wf-ink">{prod?.nome}</div>
                      <input
                        type="number"
                        min={0}
                        value={q}
                        onChange={(e) => setQtd(slug, Number(e.target.value) || 0)}
                        className="wf-input w-20"
                      />
                      <div className="w-24 text-right text-sm">{brl(preco * q)}</div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="wf-card h-fit space-y-3 p-4">
              <h2 className="text-sm font-semibold text-wf-ink">Resumo</h2>
              <div className="flex justify-between text-sm">
                <span className="text-wf-text">Total estimado</span>
                <span className="font-semibold text-wf-ink">{brl(totalPedido)}</span>
              </div>
              <button
                type="button"
                disabled={itensPedido.length === 0}
                className="wf-btn-primary w-full disabled:opacity-50"
              >
                Fechar pedido
              </button>
              <p className="text-xs text-wf-muted">
                O pedido vai para o CRM e o vendedor confirma a venda (integracao na Sprint 4).
              </p>
            </div>
          </div>
        )}

        {aba === "historico" && (
          <div className="wf-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-wf-bg text-left text-xs uppercase text-wf-muted">
                <tr>
                  <th className="p-3">Pedido</th>
                  <th className="p-3">Data</th>
                  <th className="p-3">Itens</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {historicoRevendedor.map((h) => (
                  <tr key={h.numero} className="border-t border-wf-line">
                    <td className="p-3 font-medium text-wf-ink">{h.numero}</td>
                    <td className="p-3">{new Date(h.data).toLocaleDateString("pt-BR")}</td>
                    <td className="p-3">{h.itens}</td>
                    <td className="p-3">{brl(h.total)}</td>
                    <td className="p-3">
                      <span className="wf-chip">{statusLabel[h.status]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {aba === "cadastro" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="wf-card space-y-3 p-4">
              <h2 className="text-sm font-semibold text-wf-ink">Dados da empresa</h2>
              <Linha rotulo="Empresa" valor={revendedorMock.empresa} />
              <Linha rotulo="Responsavel" valor={revendedorMock.responsavel} />
              <Linha rotulo="CNPJ" valor={revendedorMock.cnpj} />
            </div>
            <div className="wf-card space-y-3 p-4">
              <h2 className="text-sm font-semibold text-wf-ink">Endereco de entrega</h2>
              <Linha rotulo="Logradouro" valor={revendedorMock.endereco.logradouro} />
              <Linha rotulo="Bairro" valor={revendedorMock.endereco.bairro} />
              <Linha
                rotulo="Cidade / UF"
                valor={`${revendedorMock.endereco.cidade} / ${revendedorMock.endereco.uf}`}
              />
              <Linha rotulo="CEP" valor={revendedorMock.endereco.cep} />
              <button type="button" className="wf-btn-ghost">
                Editar endereco
              </button>
            </div>
          </div>
        )}

        {aba === "arquivos" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="wf-card space-y-3 p-4">
              <h2 className="text-sm font-semibold text-wf-ink">Anexar arquivos</h2>
              <div className="wf-img flex min-h-[140px] flex-col items-center justify-center rounded border border-dashed border-wf-muted text-center">
                <span>Arraste arquivos aqui</span>
                <span className="text-[10px]">ou clique para selecionar</span>
              </div>
              <input type="file" className="text-xs text-wf-text" />
            </div>
            <div className="wf-card space-y-3 p-4">
              <h2 className="text-sm font-semibold text-wf-ink">Notas do revendedor</h2>
              <textarea
                className="wf-input min-h-[140px]"
                placeholder="Observacoes sobre pedidos, prazos, preferencias de entrega..."
              />
              <button type="button" className="wf-btn-primary">
                Salvar notas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex justify-between border-b border-wf-line pb-2 text-sm">
      <span className="text-wf-muted">{rotulo}</span>
      <span className="font-medium text-wf-ink">{valor}</span>
    </div>
  );
}
