"use client";

import { useRouter } from "next/navigation";
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
import { logout, me, type RevendedorUser } from "@/lib/auth";

type Aba = "tabela" | "pedido" | "historico" | "cadastro" | "arquivos";

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Input Joy reutilizavel (campos soltos, fora de .fld).
const INPUT =
  "rounded-[12px] border-0 bg-[#f3f5ec] px-3 text-sm text-joy-ink outline-none h-10";

const statusLabel: Record<string, string> = {
  "em-analise": "Em analise",
  confirmado: "Confirmado",
  faturado: "Faturado",
};

type ItemCatalogo = { key: string; nome: string; preco: number; estoque: number | null; novo: boolean };

// Pagina sem equivalente no mockup: so reaplica o tema Joy. Toda a logica (guarda
// de rota client-side, me()/logout, catalogo, pedido, historico) mantida intacta.
export default function PainelRevendedorPage() {
  const router = useRouter();
  const [aba, setAba] = useState<Aba>("tabela");
  const [pedido, setPedido] = useState<Record<string, number>>({});
  const [manuais, setManuais] = useState<ProdutoManual[]>([]);
  const [user, setUser] = useState<RevendedorUser | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Protecao de rota client-side: sem runtime de servidor (export estatico),
  // a guarda mora aqui. Sem sessao valida, volta para o login. O acesso real
  // ja e barrado no backend (cookie httpOnly + beforeLogin), isto so evita
  // renderizar o painel para quem nao esta logado.
  useEffect(() => {
    let vivo = true;
    me().then((u) => {
      if (!vivo) return;
      if (!u) {
        router.replace("/revendedor/login");
        return;
      }
      setUser(u);
      setCarregando(false);
    });
    return () => {
      vivo = false;
    };
  }, [router]);

  // Catalogo do revendedor puxado da lista geral do site: produtos do catalogo
  // mais os cadastrados na administracao (marcados como "novo"). Wireframe: os
  // manuais vem do localStorage; na producao viriam da mesma base do Payload.
  useEffect(() => setManuais(listarManuais()), []);

  async function sair() {
    await logout();
    router.push("/");
  }

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

  if (carregando) {
    return (
      <div className="wrap flex justify-center py-24">
        <p className="text-sm text-joy-muted">Carregando área do revendedor...</p>
      </div>
    );
  }

  return (
    <div className="bg-joy-paper">
      {/* Cabecalho distinto do B2B */}
      <div className="bg-joy-deep text-white">
        <div className="wrap flex flex-wrap items-center justify-between gap-2 py-4">
          <div>
            <span className="text-xs uppercase tracking-wide text-white/60">Área do revendedor</span>
            <h1 className="text-lg font-semibold">{user?.empresa ?? revendedorMock.empresa}</h1>
          </div>
          <button type="button" onClick={sair} className="btn btn-ghost-w btn-sm">
            Sair
          </button>
        </div>
      </div>

      {/* Abas */}
      <div className="border-b border-joy-line bg-white">
        <div className="wrap flex gap-1 overflow-x-auto">
          {(
            [
              ["tabela", "Preços e estoque"],
              ["pedido", `Pedido (${itensPedido.length})`],
              ["historico", "Histórico"],
              ["cadastro", "Cadastro e entrega"],
              ["arquivos", "Arquivos e notas"],
            ] as [Aba, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setAba(id)}
              className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm ${
                aba === id
                  ? "border-joy-deep font-medium text-joy-ink"
                  : "border-transparent text-joy-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="wrap py-6">
        {aba === "tabela" && (
          <div className="space-y-3">
            <p className="text-sm text-[#3e5148]">
              Catálogo puxado da lista geral do site (produtos e SKUs cadastrados na administração).
              Itens marcados como Novo foram adicionados na administração do site.
            </p>
            <div className="overflow-x-auto rounded-joy-sm bg-white shadow-joy1">
              <table className="w-full text-sm">
                <thead className="bg-joy-paper text-left text-xs uppercase text-joy-muted">
                  <tr>
                    <th className="p-3">Produto</th>
                    <th className="p-3">Preço unit.</th>
                    <th className="p-3">Estoque</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {catalogo.map((item) => (
                    <tr key={item.key} className="border-t border-joy-line">
                      <td className="p-3 font-medium text-joy-ink">
                        {item.nome}
                        {item.novo && <span className="chip chip-orange ml-2">Novo</span>}
                      </td>
                      <td className="p-3">{brl(item.preco)}</td>
                      <td className="p-3">
                        {item.estoque === null ? (
                          <span className="text-joy-muted">--</span>
                        ) : (
                          <span className={item.estoque < 100 ? "text-[#c8202c]" : "text-[#3e5148]"}>
                            {item.estoque} un
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => addPedido(item.key)}
                          className="btn btn-ghost btn-sm"
                        >
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
            <div className="divide-y divide-joy-line rounded-joy-sm bg-white px-4 shadow-joy1">
              {itensPedido.length === 0 ? (
                <p className="py-6 text-sm text-joy-muted">
                  Nenhum item no pedido. Adicione na aba Preços e estoque.
                </p>
              ) : (
                itensPedido.map(([key, q]) => {
                  const item = itemDe(key);
                  return (
                    <div key={key} className="flex items-center gap-3 py-3">
                      <div className="flex-1 text-sm font-medium text-joy-ink">{item?.nome}</div>
                      <input
                        type="number"
                        min={0}
                        value={q}
                        onChange={(e) => setQtd(key, Number(e.target.value) || 0)}
                        className={`${INPUT} w-20`}
                      />
                      <div className="w-24 text-right text-sm">{brl((item?.preco ?? 0) * q)}</div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="h-fit space-y-3 rounded-joy bg-white p-5 shadow-joy1">
              <h2 className="text-sm font-semibold text-joy-ink">Resumo</h2>
              <div className="flex justify-between text-sm">
                <span className="text-[#3e5148]">Total estimado</span>
                <span className="font-semibold text-joy-ink">{brl(totalPedido)}</span>
              </div>
              <button
                type="button"
                disabled={itensPedido.length === 0}
                className="btn btn-cta btn-block"
                style={{ opacity: itensPedido.length === 0 ? 0.5 : 1 }}
              >
                Fechar pedido
              </button>
              <p className="text-xs text-joy-muted">
                O pedido vai para o CRM e o vendedor confirma a venda (integração na Sprint 4).
              </p>
            </div>
          </div>
        )}

        {aba === "historico" && (
          <div className="overflow-x-auto rounded-joy-sm bg-white shadow-joy1">
            <table className="w-full text-sm">
              <thead className="bg-joy-paper text-left text-xs uppercase text-joy-muted">
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
                  <tr key={h.numero} className="border-t border-joy-line">
                    <td className="p-3 font-medium text-joy-ink">{h.numero}</td>
                    <td className="p-3">{new Date(h.data).toLocaleDateString("pt-BR")}</td>
                    <td className="p-3">{h.itens}</td>
                    <td className="p-3">{brl(h.total)}</td>
                    <td className="p-3">
                      <span className="chip">{statusLabel[h.status]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {aba === "cadastro" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3 rounded-joy bg-white p-5 shadow-joy1">
              <h2 className="text-sm font-semibold text-joy-ink">Dados da empresa</h2>
              <Linha rotulo="Empresa" valor={revendedorMock.empresa} />
              <Linha rotulo="Responsável" valor={revendedorMock.responsavel} />
              <Linha rotulo="CNPJ" valor={revendedorMock.cnpj} />
            </div>
            <div className="space-y-3 rounded-joy bg-white p-5 shadow-joy1">
              <h2 className="text-sm font-semibold text-joy-ink">Endereço de entrega</h2>
              <Linha rotulo="Logradouro" valor={revendedorMock.endereco.logradouro} />
              <Linha rotulo="Bairro" valor={revendedorMock.endereco.bairro} />
              <Linha
                rotulo="Cidade / UF"
                valor={`${revendedorMock.endereco.cidade} / ${revendedorMock.endereco.uf}`}
              />
              <Linha rotulo="CEP" valor={revendedorMock.endereco.cep} />
              <button type="button" className="btn btn-ghost btn-sm">
                Editar endereço
              </button>
            </div>
          </div>
        )}

        {aba === "arquivos" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3 rounded-joy bg-white p-5 shadow-joy1">
              <h2 className="text-sm font-semibold text-joy-ink">Anexar arquivos</h2>
              <div className="flex min-h-[140px] flex-col items-center justify-center rounded-joy-sm border border-dashed border-joy-line bg-[#f3f5ec] text-center text-joy-muted">
                <span>Arraste arquivos aqui</span>
                <span className="text-[10px]">ou clique para selecionar</span>
              </div>
              <input type="file" className="text-xs text-[#3e5148]" />
            </div>
            <div className="space-y-3 rounded-joy bg-white p-5 shadow-joy1">
              <h2 className="text-sm font-semibold text-joy-ink">Notas do revendedor</h2>
              <textarea
                className="min-h-[140px] w-full rounded-[12px] border-0 bg-[#f3f5ec] p-3.5 text-sm text-joy-ink outline-none"
                placeholder="Observações sobre pedidos, prazos, preferências de entrega..."
              />
              <button type="button" className="btn btn-deep">
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
    <div className="flex justify-between border-b border-joy-line pb-2 text-sm">
      <span className="text-joy-muted">{rotulo}</span>
      <span className="font-medium text-joy-ink">{valor}</span>
    </div>
  );
}
