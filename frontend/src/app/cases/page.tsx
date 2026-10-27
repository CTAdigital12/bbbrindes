import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import FinalCta from "@/components/FinalCta";
import { getCases } from "@/lib/content";
import { QUOTES, nb } from "@/data/home-joy";

export const metadata: Metadata = {
  title: "Cases",
  description:
    "Cases e prova social: empresas de diferentes setores contam com a BB Brindes para campanhas, eventos e brindes institucionais.",
};

// Cases REAIS do cliente (collection `cases` via getCases, fallback no mock). Sem
// imagem por case (decisao 27/10): o card usa uma faixa de marca com o nome do
// cliente no lugar da foto. .quotes (depoimentos) e finalCTA seguem.
export default async function CasesPage() {
  const cases = await getCases();

  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<span>Cases</span>
      </div>
      <div className="ptitle">
        <h1>Cases e prova social</h1>
        <p>
          Empresas de diferentes setores contam com a BB Brindes para campanhas, eventos e brindes
          institucionais.
        </p>
      </div>

      <div className="cases">
        {cases.map((c) => (
          <article className="case case-text" key={c.slug}>
            <div className="ph ph-brand">
              <span className="cli">{c.cliente}</span>
            </div>
            <div className="bd">
              {c.segmento && <small>{c.segmento}</small>}
              <h3>{nb(c.titulo)}</h3>
              {c.resumo && <p className="case-resumo">{c.resumo}</p>}
            </div>
          </article>
        ))}
      </div>

      <div className="quotes">
        {QUOTES.map(([texto, autor]) => (
          <div className="qt" key={autor}>
            <Icon name="quote" />
            <div>
              <p>{texto}</p>
              <span>{autor}</span>
            </div>
          </div>
        ))}
      </div>

      <FinalCta />
    </div>
  );
}
