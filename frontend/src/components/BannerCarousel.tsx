"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Banner } from "@/lib/types";

// Carrossel rotativo do topo. Auto-rotacao com pausa no hover, controles e dots.
export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [i, setI] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado || banners.length <= 1) return;
    const id = setInterval(() => setI((x) => (x + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [pausado, banners.length]);

  const ir = (n: number) => setI((n + banners.length) % banners.length);
  const b = banners[i];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <Link
        href={b.href}
        className="wf-img flex min-h-[240px] flex-col justify-end overflow-hidden rounded-lg p-6"
      >
        <div className="relative max-w-md rounded bg-wf-surface/85 p-4">
          <span className="wf-tag">Campanha</span>
          <h2 className="mt-1 text-2xl font-bold text-wf-ink">{b.titulo}</h2>
          <p className="mt-1 text-sm text-wf-text">{b.subtitulo}</p>
          <span className="wf-btn-primary mt-3">{b.cta}</span>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => ir(i - 1)}
        aria-label="Banner anterior"
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-wf-line bg-wf-surface/90 px-3 py-1 text-wf-ink hover:bg-wf-surface"
      >
        {"<"}
      </button>
      <button
        type="button"
        onClick={() => ir(i + 1)}
        aria-label="Proximo banner"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-wf-line bg-wf-surface/90 px-3 py-1 text-wf-ink hover:bg-wf-surface"
      >
        {">"}
      </button>

      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {banners.map((bn, idx) => (
          <button
            key={bn.id}
            type="button"
            onClick={() => ir(idx)}
            aria-label={`Ir para o banner ${idx + 1}`}
            className={`h-2 w-2 rounded-full ${idx === i ? "bg-wf-accent" : "bg-wf-line"}`}
          />
        ))}
      </div>
    </div>
  );
}
