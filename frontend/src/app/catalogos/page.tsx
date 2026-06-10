import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogos",
  description: "Folheie o catalogo em flipbook ou baixe os catalogos em PDF.",
};

const catalogos = [
  { nome: "Catalogo Completo 2026", paginas: 120 },
  { nome: "Linha Green (Ecologicos)", paginas: 32 },
  { nome: "Datas Comemorativas", paginas: 24 },
];

export default function CatalogosPage() {
  return (
    <div className="wf-container py-8">
      <h1 className="text-2xl font-bold text-wf-ink">Catalogos</h1>

      {/* Flipbook */}
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold text-wf-ink">Flipbook</h2>
        <div className="wf-img flex aspect-[16/8] w-full items-center justify-center rounded-lg">
          Visualizador de flipbook (placeholder)
        </div>
        <p className="mt-2 text-xs text-wf-muted">
          Integracao do flipbook entra na Sprint 5. Aqui ficara o folheador interativo.
        </p>
      </section>

      {/* Downloads */}
      <section className="mt-10">
        <h2 className="mb-3 text-lg font-semibold text-wf-ink">Baixar em PDF</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {catalogos.map((c) => (
            <div key={c.nome} className="wf-card flex flex-col gap-3 p-4">
              <div className="wf-img aspect-[3/4] w-full rounded">PDF</div>
              <div>
                <h3 className="text-sm font-medium text-wf-ink">{c.nome}</h3>
                <p className="text-xs text-wf-muted">{c.paginas} paginas</p>
              </div>
              <button type="button" className="wf-btn-primary mt-auto">
                Baixar PDF
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
