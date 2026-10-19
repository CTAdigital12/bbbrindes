"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// Estado de UI da gaveta de orcamento (drawer #cartd). Fica separado do
// CartProvider (que guarda os itens) para que abrir/fechar a gaveta nao
// re-renderize quem so precisa dos itens, e para o Header/cards poderem
// disparar a abertura sem conhecer o estado interno do carrinho. Espelha o
// comportamento do open()/closeAll() do mockup funcional da Joy.
type CartUIContextValue = {
  aberto: boolean;
  abrir: () => void;
  fechar: () => void;
  alternar: () => void;
};

const CartUIContext = createContext<CartUIContextValue | null>(null);

export function CartUIProvider({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false);

  const abrir = () => setAberto(true);
  const fechar = () => setAberto(false);
  const alternar = () => setAberto((a) => !a);

  return (
    <CartUIContext.Provider value={{ aberto, abrir, fechar, alternar }}>
      {children}
    </CartUIContext.Provider>
  );
}

export function useCartUI(): CartUIContextValue {
  const ctx = useContext(CartUIContext);
  if (!ctx) throw new Error("useCartUI deve ser usado dentro de CartUIProvider");
  return ctx;
}
