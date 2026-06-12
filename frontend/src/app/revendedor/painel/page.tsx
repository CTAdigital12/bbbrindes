"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { produtos } from "@/data/produtos";
import {
  historicoRevendedor,
  precoPorFaixa,
  precoRevendedor,
  revendedorMock,
  tabelaRevendedor,
} from "@/data/revendedor";
import { listarManuais, type ProdutoManual } from "@/lib/lojista";

type Aba = "tabela" | "pedido" | "historico" | "cadastro" | "arquivos";

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const statusLabel: Record<string, string> = {
  "em-analise": "Em analise",
  confirmado: "Confirmado",
  faturado: "Faturado",
};

type ItemCatalogo = { key: string; nome: string; preco: number; estoque: number | null; novo: boolean };

export default function PainelRevendedorPage() {
  const [aba, setAba] = useState<Aba>("tabela");
  const [pedido, setPedido] = useState<Record<string, number>>({});
  const [manuais, setManuais] = useState<ProdutoManual[]>([]);

  // Catalogo do revendedor puxado da lista geral do site: produtos do catalogo
  // mais os cadastrados na administracao (marcados como "novo"). Wireframe: os
  // manuais vem do localStorage; na producao viriam da mesma base do Payload.
  useEffect(() => setManuais(listarManuais()), []);

  const catalogo: ItemCatalogo[] = useMemo(
    () => [
      ...produtos.map((p) => ({
        key: p.slug,
        nome: p.nome,
        preco: precoRevendedor(p.slug)?.precoUnitario ?? 0,
        estoque: tabelaRevendedor.find((t) => t.produtoSlug === p.slug)?.estoque ?? 0,
        novo: false,
      })),
      ...manuais.map((m) => ({
        key: m.id,
        nome: m.nome,
        preco: precoPorFaixa(m.faixaPreco),
        estoque: null,
        novo: true,
      })),
    ],
    [manuais],
  );

  const itemDe = (key: string) => catalogo.find((c) => c.key === key);

  const itensPedido = useMemo(
    () => Object.entries(pedido).filter(([, q]) => q > 0),
    [pedido],
  );
  const totalPedido = itensPedido.reduce(
    (acc, [key, q]) => acc + (itemDe(key)?.preco ?? 0) * q,
    0,
  );

  function addPedido(key: string) {
    setPedido((p) => ({ ...p, [key]: (p[key] ?? 0) + 1 }));
  }
  function setQtd(key: string, q: number) {
    setPedido((p) => ({ ...p, [key]: Math.max(0, q) }));
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
          <div className="space-y-3">
            <p className="text-sm text-wf-text">
              Catalogo puxado da lista geral do site (produtos e SKUs cadastrados na administracao).
              Itens marcados como Novo foram adicionados na administracao do site.
            </p>
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
                  {catalogo.map((item) => (
                    <tr key={item.key} className="border-t border-wf-line">
                      <td className="p-3 font-medium text-wf-ink">
                        {item.nome}
                        {item.novo && <span className="wf-tag ml-2">Novo</span>}
                      </td>
                      <td className="p-3">{brl(item.preco)}</td>
                      <td className="p-3">
                        {item.estoque === null ? (
                          <span className="text-wf-muted">--</span>
                        ) : (
                          <span className={item.estoque < 100 ? "text-red-600" : "text-wf-text"}>
                            {item.estoque} un
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button type="button" onClick={() => addPedido(item.key)} className="wf-btn-ghost">
                          Adicionar ao pedido
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                itensPedido.map(([key, q]) => {
                  const item = itemDe(key);
                  return (
                    <div key={key} className="flex items-center gap-3 p-3">
                      <div className="flex-1 text-sm font-medium text-wf-ink">{item?.nome}</div>
                      <input
                        type="number"
                        min={0}
                        value={q}
                        onChange={(e) => setQtd(key, Number(e.target.value) || 0)}
                        className="wf-input w-20"
                      />
                      <div className="w-24 text-right text-sm">{brl((item?.preco ?? 0) * q)}</div>
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
