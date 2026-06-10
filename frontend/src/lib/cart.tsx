"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ItemOrcamento = {
  produtoSlug: string;
  nome: string;
  cor: string;
  quantidade: number;
};

type CartContextValue = {
  itens: ItemOrcamento[];
  totalItens: number;
  adicionar: (item: ItemOrcamento) => void;
  alterarQuantidade: (index: number, quantidade: number) => void;
  remover: (index: number) => void;
  limpar: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "bbbrindes:orcamento";

export function CartProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemOrcamento[]>([]);
  const [carregado, setCarregado] = useState(false);

  // Carrega do localStorage no primeiro render (somente client).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItens(JSON.parse(raw) as ItemOrcamento[]);
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
    setItens((atual) => {
      const i = atual.findIndex(
        (it) => it.produtoSlug === item.produtoSlug && it.cor === item.cor,
      );
      if (i >= 0) {
        const copia = [...atual];
        copia[i] = { ...copia[i], quantidade: copia[i].quantidade + item.quantidade };
        return copia;
      }
      return [...atual, item];
    });
  }

  function alterarQuantidade(index: number, quantidade: number) {
    setItens((atual) =>
      atual.map((it, i) => (i === index ? { ...it, quantidade: Math.max(1, quantidade) } : it)),
    );
  }

  function remover(index: number) {
    setItens((atual) => atual.filter((_, i) => i !== index));
  }

  function limpar() {
    setItens([]);
  }

  const totalItens = itens.reduce((acc, it) => acc + it.quantidade, 0);

  return (
    <CartContext.Provider
      value={{ itens, totalItens, adicionar, alterarQuantidade, remover, limpar }}
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
