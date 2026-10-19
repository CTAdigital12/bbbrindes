import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import FinalCta from "@/components/FinalCta";
import { img } from "@/lib/asset";
import { CASES6, QUOTES, nb } from "@/data/home-joy";

export const metadata: Metadata = {
  title: "Cases",
  description:
    "Cases e prova social: empresas de diferentes setores contam com a BB Brindes para campanhas, eventos e brindes institucionais.",
};

// Espelha cases(): casesHTML(6) + .quotes (2) + finalCTA. Os cases sao
// ilustrativos (imagem de produto como stand-in, chip "Ilustrativo"), portados
// do array CASES(6) do mockup (data/home-joy CASES6).
export default function CasesPage() {
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
        {CASES6.map(([cliente, segmento, titulo, imagem]) => (
          // Cases ilustrativos: o clique leva ao blog (nao ha case real/detalhe).
          <Link className="case" href="/blog" key={cliente}>
            <div className="ph">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(imagem)} alt="" loading="lazy" />
              <span className="chip">Ilustrativo</span>
            </div>
            <div className="bd">
              <small>{segmento}</small>
              <h3>
                {cliente}: {nb(titulo.toLowerCase())}
              </h3>
            </div>
          </Link>
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
