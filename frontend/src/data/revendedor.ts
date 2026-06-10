import type { PedidoRevendedor, RevendedorPreco } from "@/lib/types";
import { produtos } from "@/data/produtos";

// Preco e estoque por produto: visiveis SOMENTE na area logada do revendedor.
// Gerados de forma deterministica a partir do catalogo mockado.
const precoBaseFaixa: Record<string, number> = {
  "ate-3-99": 2.9,
  "4-a-15": 8.5,
  "acima-de-15": 24.9,
};

export const tabelaRevendedor: RevendedorPreco[] = produtos.map((p, i) => ({
  produtoSlug: p.slug,
  precoUnitario: precoBaseFaixa[p.faixaPreco],
  estoque: ((i * 137) % 900) + 50,
}));

export function precoRevendedor(slug: string): RevendedorPreco | undefined {
  return tabelaRevendedor.find((t) => t.produtoSlug === slug);
}

// Historico de pedidos mockado para o painel.
export const historicoRevendedor: PedidoRevendedor[] = [
  { numero: "REV-1042", data: "2026-06-02", itens: 4, total: 1860.0, status: "faturado" },
  { numero: "REV-1051", data: "2026-06-06", itens: 2, total: 540.0, status: "confirmado" },
  { numero: "REV-1058", data: "2026-06-09", itens: 7, total: 3120.0, status: "em-analise" },
];

export const revendedorMock = {
  empresa: "Distribuidora Exemplo Ltda",
  responsavel: "Fabio (revendedor demo)",
  cnpj: "00.000.000/0001-00",
  endereco: {
    logradouro: "Rua Exemplo, 123",
    bairro: "Centro",
    cidade: "Lauro de Freitas",
    uf: "BA",
    cep: "42700-000",
  },
};
