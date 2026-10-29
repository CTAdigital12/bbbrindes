import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import CompartilharCatalogo from "@/components/CompartilharCatalogo";
import { pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Catálogo digital",
  description:
    "Folheie o catálogo da BB Brindes online, em flipbook, e compartilhe o link com quem decide a compra.",
};

// Flipbook unico (heyzine). Os cards sao atalhos pro mesmo catalogo; quando
// houver flipbooks separados por tema, viram links proprios.
const FLIP = "https://heyzine.com/flip-book/aa2476761e.html";

const CARDS = [
  "Catálogo BB Brindes 2027",
  "Linha Green (ecológicos)",
  "Datas comemorativas",
];

export default function CatalogosPage() {
  const compartilharUrl = pageUrl("/catalogos");
  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<span>Catálogo digital</span>
      </div>
      <div className="ptitle">
        <h1>Catálogo digital</h1>
        <p>Folheie online e compartilhe o link com quem decide a compra.</p>
      </div>

      <div className="flip">
        <iframe
          src={FLIP}
          title="Catálogo BB Brindes 2027"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <section className="sec">
        <div className="press">
          {CARDS.map((nome) => (
            <div className="pr" key={nome}>
              <small>
                <Icon name="book-2" /> Flipbook
              </small>
              <b>{nome}</b>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginTop: "8px",
                }}
              >
                <Link className="btn btn-deep btn-sm" href="/catalogos">
                  Folhear
                </Link>
                <CompartilharCatalogo url={compartilharUrl} titulo={nome} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
