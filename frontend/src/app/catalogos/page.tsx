import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";

export const metadata: Metadata = {
  title: "Catálogos",
  description:
    "Folheie o catálogo online ou baixe em PDF: catálogo completo, linha Green e datas comemorativas.",
};

// PDFs do mockup catalogos() (.press): nome + numero de paginas.
const PDFS: [nome: string, paginas: string][] = [
  ["Catálogo completo 2026", "120 páginas"],
  ["Linha Green (ecológicos)", "32 páginas"],
  ["Datas comemorativas", "24 páginas"],
];

export default function CatalogosPage() {
  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<span>Catálogos</span>
      </div>
      <div className="ptitle">
        <h1>Catálogos</h1>
        <p>Folheie online ou baixe em PDF.</p>
      </div>

      {/* Visualizador de flipbook: integracao futura (placeholder visivel). */}
      <div className="map" style={{ aspectRatio: "16/7" }}>
        <Icon name="notes" className="big" />
        Visualizador de flipbook
      </div>

      <section className="sec">
        <div className="press">
          {PDFS.map(([nome, paginas]) => (
            <div className="pr" key={nome}>
              <small>
                <Icon name="file-type-pdf" /> PDF · {paginas}
              </small>
              <b>{nome}</b>
              <a
                className="btn btn-ghost btn-sm"
                style={{ alignSelf: "flex-start", marginTop: "8px" }}
                href="#"
              >
                Baixar PDF
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
