"use client";

import { useEffect, useState } from "react";
import type { Produto } from "@/lib/types";
import Rail from "@/components/Rail";
import ProductCardJoy from "@/components/ProductCardJoy";

// "Vistos recentemente" (trilho bb_recent do mockup produto()): registra o
// produto atual no localStorage ao abrir a PDP e mostra os anteriores num Rail.
// So aparece quando ha mais de 1 produto visto (o atual + pelo menos outro),
// como o `recent.length>1` do mockup. Export estatico: tudo client-side, sem API.

const STORAGE_KEY = "bb_recent";
const MAX = 8;

// Registro compacto guardado no localStorage (so o que o card precisa), para
// nao depender do catalogo inteiro num site estatico.
type Recente = {
  slug: string;
  nome: string;
  categoria: string;
  imagens: string[];
  cores: { nome: string; hex: string }[];
  tags: string[];
  destaques: Produto["destaques"];
};

const compactar = (p: Produto): Recente => ({
  slug: p.slug,
  nome: p.nome,
  categoria: p.categoria,
  imagens: (p.imagens ?? []).slice(0, 2),
  cores: p.cores ?? [],
  tags: p.tags ?? [],
  destaques: p.destaques ?? [],
});

// Reconstroi um Produto a partir do registro compacto, com defaults sensatos
// para os campos que o card nao usa.
const expandir = (r: Recente): Produto => ({
  slug: r.slug,
  nome: r.nome,
  categoria: r.categoria,
  descricao: "",
  material: "",
  aplicacoes: [],
  cores: r.cores ?? [],
  personalizavel: true,
  faixaPreco: "4-a-15",
  destaques: r.destaques ?? [],
  tags: r.tags ?? [],
  imagens: r.imagens ?? [],
});

export default function VistosRecentemente({ produto }: { produto: Produto }) {
  const [outros, setOutros] = useState<Recente[]>([]);

  useEffect(() => {
    let lista: Recente[] = [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) lista = JSON.parse(raw) as Recente[];
    } catch {
      lista = [];
    }
    const atual = compactar(produto);
    const nova = [atual, ...lista.filter((r) => r && r.slug !== produto.slug)].slice(0, MAX);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nova));
    } catch {
      // ignora (modo privado / storage bloqueado)
    }
    setOutros(nova.filter((r) => r.slug !== produto.slug));
  }, [produto]);

  if (outros.length === 0) return null;

  return (
    <section className="sec">
      <div className="shead">
        <h2 style={{ fontSize: 24 }}>Vistos recentemente</h2>
      </div>
      <Rail id="tr-rec">
        {outros.map((r) => (
          <ProductCardJoy key={r.slug} produto={expandir(r)} />
        ))}
      </Rail>
    </section>
  );
}
