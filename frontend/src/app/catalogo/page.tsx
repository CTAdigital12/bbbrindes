import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogoClient from "@/components/CatalogoClient";

export const metadata: Metadata = {
  title: "Catalogo",
  description:
    "Catalogo de brindes corporativos com busca e filtros por categoria, material, aplicacao, cor e faixa de preco.",
};

export default function CatalogoPage() {
  return (
    <Suspense
      fallback={<div className="wf-container py-6 text-sm text-wf-muted">Carregando catalogo...</div>}
    >
      <CatalogoClient />
    </Suspense>
  );
}
