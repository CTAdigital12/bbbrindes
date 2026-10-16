"use client";

import { useEffect, useState } from "react";

// Contagem regressiva ate 31/out 23:59:59 do ano corrente (corte recomendado de
// Natal). Espelha o countdown() do mockup. Calcula so no cliente (apos montar)
// para nao dar mismatch de hidratacao com o horario do build.
type Parts = { d: number; h: number; m: number } | { over: true } | null;

export default function Countdown() {
  const [p, setP] = useState<Parts>(null);

  useEffect(() => {
    const end = new Date(new Date().getFullYear(), 9, 31, 23, 59, 59);
    const tick = () => {
      const ms = Math.max(0, +end - Date.now());
      if (ms <= 0) {
        setP({ over: true });
        return;
      }
      setP({
        d: Math.floor(ms / 864e5),
        h: Math.floor(ms / 36e5) % 24,
        m: Math.floor(ms / 6e4) % 60,
      });
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);

  if (!p) return <div className="cd" />;
  if ("over" in p) {
    return (
      <div className="cd">
        <div>
          <small>Fale com o especialista sobre o prazo</small>
        </div>
      </div>
    );
  }

  const pad = (x: number) => String(x).padStart(2, "0");
  const boxes: [number, string][] = [
    [p.d, "dias"],
    [p.h, "horas"],
    [p.m, "min"],
  ];

  return (
    <div className="cd">
      {boxes.map(([v, label]) => (
        <div key={label}>
          <b>{pad(v)}</b>
          <small>{label}</small>
        </div>
      ))}
      <div style={{ textAlign: "left", minWidth: 0, background: "none", boxShadow: "none", padding: "8px 0" }}>
        <small style={{ fontSize: "12px" }}>
          para o corte
          <br />
          recomendado de Natal
        </small>
      </div>
    </div>
  );
}
