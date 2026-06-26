"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Produto } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Faixa de lancamentos randomicos. Mostra 6 no celular/tablet (grade par, sem
// card orfao) e 5 no desktop (o 6o card fica oculto em lg). Comeca deterministico
// (igual ao export estatico) e embaralha apos montar, evitando mismatch de hidratacao.
export default function DestaquesRandom({ produtos }: { produtos: Produto[] }) {
  const [lista, setLista] = useState<Produto[]>(() => produtos.slice(0, 6));

  useEffect(() => {
    setLista(embaralhar(produtos).slice(0, 6));
  }, [produtos]);

  return (
    <section className="wf-container py-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-wf-ink">Lancamentos</h2>
        <Link href="/catalogo" className="text-sm text-wf-accent hover:underline">
          Ver todos
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {lista.map((p, i) => (
          <ProductCard
            key={p.slug}
            produto={p}
            compacto
            ocultarCores
            className={i === 5 ? "lg:hidden" : ""}
          />
        ))}
      </div>
    </section>
  );
}
