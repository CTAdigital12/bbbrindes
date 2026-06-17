import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clipping de imprensa",
  description: "A bbbrindes na imprensa: materias, mencoes e premios.",
};

// Placeholder de navegacao (S01-12). O conteudo real (lista de materias com
// veiculo, data e link) entra no card S01-09 do grupo Conteudo.
export default function ClippingPage() {
  return (
    <div className="wf-container py-8">
      <h1 className="text-2xl font-bold text-wf-ink">Clipping de imprensa</h1>
      <p className="mt-2 max-w-2xl text-sm text-wf-text">
        A bbbrindes na midia: materias, mencoes e premios. Esta secao reune os registros de
        imprensa.
      </p>
      <p className="mt-1 text-xs text-wf-muted">Conteudo em construcao (card S01-09).</p>

      <ul className="mt-6 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="wf-card flex items-center gap-4 p-4">
            <span className="wf-img h-14 w-20 shrink-0 rounded" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-medium text-wf-ink">Titulo da materia</h2>
              <p className="text-xs text-wf-muted">Veiculo de imprensa - data</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
