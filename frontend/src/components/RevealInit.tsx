"use client";

import { useEffect } from "react";

// Revela as secoes .reveal ao entrar na viewport, adicionando .in (o design-system.css
// deixa .reveal em opacity:0 ate .in). Espelha o IntersectionObserver do after()
// do mockup. Sem isso, a maior parte da home ficaria invisivel. Fallback: se nao
// houver IntersectionObserver, mostra tudo de imediato.
export default function RevealInit() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
