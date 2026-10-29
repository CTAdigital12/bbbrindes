"use client";

import { useState } from "react";
import Icon from "@/components/Icon";

// Botao "Compartilhar" dos cards do catalogo: usa a Web Share API quando existe
// (mobile), senao copia o link e da um feedback curto no proprio botao.
export default function CompartilharCatalogo({
  url,
  titulo,
}: {
  url: string;
  titulo: string;
}) {
  const [copiado, setCopiado] = useState(false);

  async function compartilhar() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: titulo, url });
      } catch {
        /* usuario cancelou o compartilhamento */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* sem clipboard disponivel */
    }
  }

  return (
    <button type="button" className="btn btn-ghost btn-sm" onClick={compartilhar}>
      <Icon name="share" />
      {copiado ? "Link copiado!" : "Compartilhar"}
    </button>
  );
}
