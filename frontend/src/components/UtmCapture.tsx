"use client";

import { useEffect } from "react";
import { capturarUtm } from "@/lib/utm";

// Dispara a captura de UTM cedo no carregamento, em qualquer pagina de entrada
// (fica montado no layout raiz). Roda uma vez por carregamento; a persistencia e
// a protecao de erro ficam em lib/utm.ts. Nao renderiza nada.
export default function UtmCapture() {
  useEffect(() => {
    capturarUtm();
  }, []);

  return null;
}
