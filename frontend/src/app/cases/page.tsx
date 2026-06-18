import type { Metadata } from "next";
import Link from "next/link";
import { cases } from "@/data/cases";

export const metadata: Metadata = {
  title: "Cases",
  description: "Cases e prova social: clientes, campanhas e depoimentos de quem confia na bbbrindes.",
};

export default function CasesPage() {
  const depoimentos = cases.filter((c) => c.depoimento);

  return (
    <div className="wf-container py-8">
      <h1 className="text-2xl font-bold text-wf-ink">Cases e prova social</h1>
      <p className="mt-2 max-w-2xl text-sm text-wf-text">
        Empresas de diferentes setores contam com a bbbrindes para campanhas, eventos e brindes
        institucionais. Conheca alguns projetos.
      </p>
      <p className="mt-1 text-xs text-wf-muted">Exemplos ilustrativos. Dados ficticios para o wireframe.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => (
          <article key={c.slug} className="wf-card overflow-hidden">
            <div className="wf-img flex aspect-[16/9] w-full items-center justify-center text-sm font-semibold text-wf-ink">
              {c.cliente}
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-wf-muted">{c.segmento}</p>
              <h2 className="mt-1 text-sm font-semibold text-wf-ink">{c.titulo}</h2>
              <p className="mt-1 text-xs text-wf-text">{c.resumo}</p>
            </div>
          </article>
        ))}
      </div>

      {depoimentos.length > 0 && (
        <>
          <h2 className="mt-12 text-lg font-semibold text-wf-ink">Depoimentos</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {depoimentos.map((c) => {
              const d = c.depoimento;
              if (!d) return null;
              return (
                <blockquote key={c.slug} className="wf-card p-5">
                  <p className="text-sm italic text-wf-text">{`"${d.texto}"`}</p>
                  <footer className="mt-3 text-xs font-medium text-wf-ink">
                    {d.autor} · {c.cliente}
                  </footer>
                </blockquote>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-12 wf-card flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-wf-text">Quer um projeto assim para a sua marca?</p>
        <div className="flex gap-2">
          <Link href="/orcamento" className="wf-btn-primary">
            Montar orcamento
          </Link>
          <Link href="/contato" className="wf-btn-ghost">
            Falar com o comercial
          </Link>
        </div>
      </div>
    </div>
  );
}
