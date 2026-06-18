import type { Metadata } from "next";
import { materias } from "@/data/imprensa";

export const metadata: Metadata = {
  title: "Imprensa",
  description: "A bbbrindes na imprensa: materias, releases e mencoes na midia.",
};

function dataBR(iso: string) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export default function ImprensaPage() {
  return (
    <div className="wf-container py-8">
      <h1 className="text-2xl font-bold text-wf-ink">Imprensa</h1>
      <p className="mt-2 max-w-2xl text-sm text-wf-text">
        Materias, releases e mencoes da bbbrindes e do Grupo BB na midia.
      </p>
      <p className="mt-1 text-xs text-wf-muted">Exemplos ilustrativos. Dados ficticios para o wireframe.</p>

      <ul className="mt-6 space-y-3">
        {materias.map((m) => (
          <li
            key={m.id}
            className="wf-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
          >
            <span className="wf-img flex h-16 w-24 shrink-0 items-center justify-center rounded text-xs font-semibold text-wf-ink">
              {m.veiculo}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-wf-muted">
                {m.veiculo} · {dataBR(m.data)}
              </p>
              <h2 className="text-sm font-semibold text-wf-ink">{m.titulo}</h2>
              <p className="mt-1 text-xs text-wf-text">{m.resumo}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
