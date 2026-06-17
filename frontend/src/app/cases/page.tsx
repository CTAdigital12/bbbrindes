import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cases",
  description: "Cases e prova social de clientes atendidos pela bbbrindes.",
};

// Placeholder de navegacao (S01-12). O conteudo real (depoimentos, logos de
// clientes, resultados) entra no card S01-08 do grupo Conteudo.
export default function CasesPage() {
  return (
    <div className="wf-container py-8">
      <h1 className="text-2xl font-bold text-wf-ink">Cases e prova social</h1>
      <p className="mt-2 max-w-2xl text-sm text-wf-text">
        Projetos e clientes atendidos pela bbbrindes. Esta secao recebe depoimentos, logos de
        clientes e resultados.
      </p>
      <p className="mt-1 text-xs text-wf-muted">Conteudo em construcao (card S01-08).</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="wf-card overflow-hidden">
            <div className="wf-img aspect-[16/9] w-full">Imagem do case</div>
            <div className="p-3">
              <h2 className="text-sm font-medium text-wf-ink">Case do cliente</h2>
              <p className="mt-1 line-clamp-2 text-xs text-wf-text">
                Resumo do desafio, da solucao em brindes e do resultado.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
