"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Item do orcamento no modelo cor BASE x ACESSORIO + ate 3 quantidades (task
// 9910008, reuniao Joy 25/11). O carrinho guarda o VALOR da cor de cada bloco
// (corBase/corAcessorio) e tambem o ROTULO do bloco (rotuloBase/rotuloAcessorio,
// ex. "Garrafa"/"Tampa") para exibir "Garrafa preto - Tampa creme" na gaveta e no
// orcamento sem precisar do produto completo. `qtds` sao as quantidades pedidas
// (1 obrigatoria + ate 2 opcionais, cada uma >= minimo). `codigoSite` acompanha o
// item para exibir "Cod. X". `imagem` segue crua (o display resolve via imgSrc).
export type ItemOrcamento = {
  produtoSlug: string;
  nome: string;
  // Cor do bloco BASE (ex. "Preto"). Opcional (produto de cor unica pode nao ter).
  corBase?: string;
  // Cor do bloco ACESSORIO (ex. "Creme"), so quando o produto tem o 2o bloco.
  corAcessorio?: string;
  // Rotulo do bloco base/acessorio (ex. "Garrafa"/"Tampa"), para a exibicao.
  rotuloBase?: string;
  rotuloAcessorio?: string;
  // Quantidades pedidas (ate 3). A 1a e obrigatoria; as demais sao faixas extras.
  qtds: number[];
  imagem?: string;
  // Codigo do produto no site (Payload: codigoSite). Opcional.
  codigoSite?: string;
};

// Shape legado do item (antes da reuniao Joy): cor unica como string + 1 quantidade.
// Usado so na MIGRACAO do que ja estava salvo no localStorage do usuario.
type ItemLegado = Partial<ItemOrcamento> & {
  cor?: string;
  quantidade?: number;
};

type CartContextValue = {
  itens: ItemOrcamento[];
  // Soma das unidades de todos os itens (todas as faixas de todos os itens).
  totalItens: number;
  // Numero de produtos distintos no orcamento (uma entrada por produto+cores).
  // E o que o selo do botao "Orcamento" mostra.
  totalProdutos: number;
  adicionar: (item: ItemOrcamento) => void;
  // Altera UMA das quantidades (slot 0..2) de um item. Permite 0 (faixa vazia);
  // a regra de minimo e exibida na UI, nao travada aqui.
  alterarQuantidade: (index: number, slot: number, quantidade: number) => void;
  remover: (index: number) => void;
  limpar: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "bbbrindes:orcamento";

// Soma as quantidades validas (> 0) de um item.
export const somaQtds = (qtds: number[]): number =>
  (qtds ?? []).reduce((acc, n) => acc + (typeof n === "number" && n > 0 ? n : 0), 0);

// Texto das cores de um item: "Garrafa preto - Tampa creme" (rotulo + cor em
// minusculo, juntados por " - "). Rotulo cai em "Cor" quando vazio. Sem cor,
// devolve string vazia. Compartilhado pela gaveta, orcamento, sucesso e exit.
export function coresDoItem(it: ItemOrcamento): string {
  const partes: string[] = [];
  if (it.corBase) partes.push(`${it.rotuloBase || "Cor"} ${it.corBase.toLowerCase()}`);
  if (it.corAcessorio) partes.push(`${it.rotuloAcessorio || "Cor"} ${it.corAcessorio.toLowerCase()}`);
  return partes.join(" · ");
}

// Normaliza qualquer item (novo OU legado) para o shape atual. MIGRACAO: converte
// o item antigo ({cor, quantidade}) para o novo ({corBase: cor, qtds: [quantidade]})
// sem jogar fora nada que o usuario ja tinha salvo. Tolerante a dado corrompido.
export function normalizarItem(raw: ItemLegado): ItemOrcamento {
  const qtdsBrutas = Array.isArray(raw.qtds)
    ? raw.qtds
    : typeof raw.quantidade === "number"
      ? [raw.quantidade]
      : [];
  const qtds = qtdsBrutas
    .map((n) => Math.trunc(Number(n)))
    .filter((n) => Number.isFinite(n) && n > 0)
    .slice(0, 3);
  return {
    produtoSlug: typeof raw.produtoSlug === "string" ? raw.produtoSlug : "",
    nome: typeof raw.nome === "string" ? raw.nome : "",
    // corBase novo; cai no `cor` legado quando ausente.
    corBase: raw.corBase ?? raw.cor ?? undefined,
    corAcessorio: raw.corAcessorio ?? undefined,
    rotuloBase: raw.rotuloBase ?? undefined,
    rotuloAcessorio: raw.rotuloAcessorio ?? undefined,
    qtds,
    imagem: raw.imagem,
    codigoSite: raw.codigoSite,
  };
}

// Chave de deduplicacao: mesmo produto + mesma cor base + mesma cor acessorio.
const chaveDedup = (it: ItemOrcamento): string =>
  `${it.produtoSlug}|${it.corBase ?? ""}|${it.corAcessorio ?? ""}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemOrcamento[]>([]);
  const [carregado, setCarregado] = useState(false);

  // Carrega do localStorage no primeiro render (somente client), migrando
  // itens no formato antigo para o novo. Nunca quebra um orcamento ja salvo.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const bruto = JSON.parse(raw) as unknown;
        if (Array.isArray(bruto)) setItens(bruto.map((i) => normalizarItem(i as ItemLegado)));
      }
    } catch {
      // ignora dados corrompidos
    }
    setCarregado(true);
  }, []);

  // Persiste sempre que o carrinho muda.
  useEffect(() => {
    if (!carregado) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
  }, [itens, carregado]);

  function adicionar(item: ItemOrcamento) {
    const novo = normalizarItem(item);
    setItens((atual) => {
      const i = atual.findIndex((it) => chaveDedup(it) === chaveDedup(novo));
      if (i >= 0) {
        // Mesmo produto e mesmas cores: o usuario reconfigurou. A ultima selecao
        // vence (substitui as quantidades/imagem), em vez de somar: com faixas de
        // quantidade somar nao faz sentido.
        const copia = [...atual];
        copia[i] = novo;
        return copia;
      }
      return [...atual, novo];
    });
  }

  function alterarQuantidade(index: number, slot: number, quantidade: number) {
    if (slot < 0 || slot > 2) return;
    setItens((atual) =>
      atual.map((it, i) => {
        if (i !== index) return it;
        const qtds = it.qtds.slice(0, 3);
        while (qtds.length <= slot && qtds.length < 3) qtds.push(0);
        qtds[slot] = Math.max(0, Math.trunc(Number.isFinite(quantidade) ? quantidade : 0));
        return { ...it, qtds };
      }),
    );
  }

  function remover(index: number) {
    setItens((atual) => atual.filter((_, i) => i !== index));
  }

  function limpar() {
    setItens([]);
  }

  const totalItens = itens.reduce((acc, it) => acc + somaQtds(it.qtds), 0);
  const totalProdutos = itens.length;

  return (
    <CartContext.Provider
      value={{ itens, totalItens, totalProdutos, adicionar, alterarQuantidade, remover, limpar }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
