"use client";

// Contexto das categorias do site, alimentado pelo layout (server) com
// getCategorias() (admin/Payload, fallback no mock). Permite que os componentes
// client (menu, filtro do catalogo, cards, PDP) leiam a MESMA lista que veio do
// admin, sem props-drilling e sem importar a lista fixa de data/categorias.ts.
// Assim, apagar/renomear uma categoria no painel reflete no site (fix estrutural
// do "In Mold Label", que o #105 so resolveu como stopgap na lista fixa).

import { createContext, useCallback, useContext, type ReactNode } from "react";
import { type Categoria, nomeCategoriaDe } from "@/lib/types";

const CategoriasContext = createContext<Categoria[]>([]);

export function CategoriasProvider({
  categorias,
  children,
}: {
  categorias: Categoria[];
  children: ReactNode;
}) {
  return <CategoriasContext.Provider value={categorias}>{children}</CategoriasContext.Provider>;
}

// Lista completa de categorias do admin (ordem do painel).
export function useCategorias(): Categoria[] {
  return useContext(CategoriasContext);
}

// Resolvedor de nome por slug, estavel entre renders (a lista do contexto nao
// muda no client), seguro de usar em dependencias de hooks.
export function useNomeCategoria(): (slug: string) => string {
  const categorias = useContext(CategoriasContext);
  return useCallback((slug: string) => nomeCategoriaDe(categorias, slug), [categorias]);
}
