import type { Metadata } from "next";
import CatalogoClient from "@/components/CatalogoClient";

export const metadata: Metadata = {
  title: "Catalogo",
  description: "Catalogo de brindes corporativos com busca e filtros por categoria, material, aplicacao, cor e faixa de preco.",
};

type SearchParams = Promise<{
  q?: string;
  categoria?: string;
  material?: string;
  aplicacao?: string;
  faixa?: string;
  cor?: string;
}>;

export default async function CatalogoPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  return (
    <CatalogoClient
      inicial={{
        q: sp.q,
        categoria: sp.categoria,
        material: sp.material,
        aplicacao: sp.aplicacao,
        faixa: sp.faixa,
        cor: sp.cor,
      }}
    />
  );
}
