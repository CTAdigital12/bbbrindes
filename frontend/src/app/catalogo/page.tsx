import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogoClient from "@/components/CatalogoClient";
import { getProdutos } from "@/lib/produtos";
import { getCampanhas } from "@/lib/content";

export const metadata: Metadata = {
  title: "Catalogo",
  description:
    "Catalogo de brindes corporativos com busca e filtros por categoria, material, aplicacao, cor e faixa de preco.",
};

export default async function CatalogoPage() {
  // Produtos reais do backend no build (fallback pro mock). A vitrine filtra
  // client-side em cima dessa lista.
  const produtos = await getProdutos();
  // Campanhas publicadas (slug -> produtos) alimentam o filtro ?campanha= do
  // catalogo, acionado pelo link "Ver todos os produtos" da landing de campanha.
  const campanhas = await getCampanhas();
  return (
    <Suspense
      fallback={<div className="wf-container py-6 text-sm text-wf-muted">Carregando catalogo...</div>}
    >
      <CatalogoClient produtos={produtos} campanhas={campanhas} />
    </Suspense>
  );
}
