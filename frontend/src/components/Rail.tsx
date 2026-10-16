"use client";

import { useRef, type ReactNode } from "react";
import Icon from "@/components/Icon";

// Trilho horizontal (.rail) com setas prev/next que rolam o .track, espelhando o
// rail()/data-act="rail" do mockup. Os cards vem como children (server
// components renderizados no page.tsx).
export default function Rail({ id, children }: { id: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (d: number) => {
    const tr = ref.current;
    if (tr) tr.scrollBy({ left: tr.clientWidth * 0.8 * d, behavior: "smooth" });
  };

  return (
    <div className="rail">
      <button className="ra l" onClick={() => scroll(-1)} aria-label="Anterior">
        <Icon name="chevron-left" />
      </button>
      <div className="track" id={id} ref={ref}>
        {children}
      </div>
      <button className="ra r" onClick={() => scroll(1)} aria-label="Próximo">
        <Icon name="chevron-right" />
      </button>
    </div>
  );
}
