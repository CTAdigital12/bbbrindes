"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Case } from "@/lib/types";
import { nb } from "@/data/home-joy";

// A home exibe 3 cases de prova social. Como o site e estatico (SSG), o sorteio
// precisa ser no cliente para variar a cada visita: um Math.random() no servidor
// so mudaria a cada build. No SSR / sem JS mostra os 3 "inicial" (marcas fortes),
// o que da um fallback bom e evita mismatch de hydration; apos o mount sorteia 3
// cases aleatorios do conjunto completo (Fisher-Yates) e troca.
export default function CasesHome({ cases, inicial }: { cases: Case[]; inicial: Case[] }) {
  const [sel, setSel] = useState<Case[]>(inicial);

  useEffect(() => {
    if (cases.length <= 3) {
      setSel(cases);
      return;
    }
    const arr = [...cases];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setSel(arr.slice(0, 3));
  }, [cases]);

  return (
    <div className="cases">
      {sel.map((c) => (
        // Sem foto por case (decisao 27/10): faixa de marca com o nome do cliente.
        // Clique leva direto ao case na /cases (ancora #slug, F2).
        <Link className="case case-text" href={`/cases#${c.slug}`} key={c.slug}>
          <div className="ph ph-brand">
            <span className="cli">{c.cliente}</span>
          </div>
          <div className="bd">
            {c.segmento ? <small>{c.segmento}</small> : null}
            <h3>{nb(c.titulo)}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
