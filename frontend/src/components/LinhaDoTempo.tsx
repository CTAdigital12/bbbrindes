"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Icon from "@/components/Icon";
import { img } from "@/lib/asset";
import { HIST_STEPS } from "@/data/historia";

// Linha do tempo em rolagem (mockup 28/10). A secao fica presa na tela e a
// rolagem avanca os marcos; o mostrador gira um passo por marco e o ano ativo
// se liga ao ano grande. Fotos em public/img/historia/<ano>.webp.

const DEG = 14; // graus por marco
const R = 520; // raio base do mostrador

// Tracinhos fixos ao redor do mostrador (um a cada 2 graus; mais longos a cada 7).
const TICKS = Array.from({ length: 180 }, (_, k) => ({
  x1: R - (k % 7 === 0 ? 34 : 18),
  a: k * 2,
}));

export default function LinhaDoTempo() {
  const n = HIST_STEPS.length;
  const ref = useRef<HTMLElement>(null);
  const [k, setK] = useState(0);
  const [fim, setFim] = useState(false);
  const [hh, setHh] = useState(0);

  // Altura do header sticky, pra prender o stage logo abaixo dele.
  useEffect(() => {
    const medir = () => {
      const h = document.querySelector("header.site") as HTMLElement | null;
      setHh(h ? h.offsetHeight : 0);
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, []);

  // Rolagem: progresso 0..1 ao longo da secao -> marco ativo.
  useEffect(() => {
    const onScroll = () => {
      const s = ref.current;
      if (!s) return;
      const tot = s.offsetHeight - window.innerHeight;
      const pr = Math.min(1, Math.max(0, -s.getBoundingClientRect().top / Math.max(1, tot)));
      setK(Math.min(n - 1, Math.round(pr * (n - 1))));
      setFim(pr > 0.98);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [n]);

  return (
    <section
      className={`hscroll${fim ? " fim" : ""}`}
      id="historia"
      ref={ref}
      style={{ "--n": n, "--hh": `${hh}px` } as CSSProperties}
    >
      <div className="hstage">
        <div className="hdial" aria-hidden="true">
          <svg viewBox="-640 -640 1280 1280">
            <circle r={R + 6} className="ring" />
            <circle r={R - 60} className="ring2" />
            <g id="hrot" style={{ transform: `rotate(${k * DEG}deg)` }}>
              <g className="ticks">
                {TICKS.map((t, i) => (
                  <line key={i} x1={t.x1} y1={0} x2={R} y2={0} transform={`rotate(${t.a})`} />
                ))}
              </g>
              <g className="hyrs">
                {HIST_STEPS.map((h, i) => (
                  <text
                    key={h.ano}
                    className={i === k ? "on" : undefined}
                    transform={`rotate(${-i * DEG}) translate(${R + 30} 0) rotate(90)`}
                  >
                    {h.ano}
                  </text>
                ))}
              </g>
            </g>
          </svg>
        </div>

        <div className="hline" aria-hidden="true" />

        <div className="hphoto" aria-hidden="true">
          {HIST_STEPS.map((h, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={h.ano}
              src={img(`/img/historia/${h.ano}.webp`)}
              alt=""
              loading="lazy"
              className={i === k ? "on" : undefined}
            />
          ))}
        </div>

        <div className="hcount">
          <span>{String(k + 1).padStart(2, "0")}</span>
          <i />
          <span>{String(n).padStart(2, "0")}</span>
        </div>

        <div className="htitle">
          <b>Nossa história</b>
          <small>Desde 2000 · Grupo BB</small>
        </div>

        <div className="htext">
          {HIST_STEPS.map((h, i) => (
            <div key={h.ano} className={`ht${i === k ? " on" : ""}`}>
              <h3>{h.titulo}</h3>
              <p>{h.texto}</p>
            </div>
          ))}
        </div>

        <div className="hyear in" key={k}>
          {HIST_STEPS[k].ano}
        </div>

        <div className="hhint">
          Role para atravessar a história
          <Icon name="chevron-down" />
        </div>
      </div>
    </section>
  );
}
