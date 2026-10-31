import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import CompartilharCatalogo from "@/components/CompartilharCatalogo";
import { getCatalogos } from "@/lib/content";
import { pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Catálogo digital",
  description:
    "Folheie o catálogo da BB Brindes online, em flipbook, e compartilhe o link com quem decide a compra.",
};

// Titulo, intro, URL do flipbook (heyzine) e os cards de atalho vem do global
// `catalogos` (getCatalogos), com fallback no mock. Card com url propria abre
// aquele flipbook; sem url, abre o flipbook principal da pagina.
export default async function CatalogosPage() {
  const cat = await getCatalogos();
  const compartilharUrl = pageUrl("/catalogos");
  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<span>Catálogo digital</span>
      </div>
      <div className="ptitle">
        <h1>{cat.titulo}</h1>
        <p>{cat.intro}</p>
      </div>

      <div className="flip">
        <iframe src={cat.flipbookUrl} title={cat.titulo} allowFullScreen loading="lazy" />
      </div>

      <section className="sec">
        <div className="press">
          {cat.itens.map((item) => (
            <div className="pr" key={item.nome}>
              <small>
                <Icon name="book-2" /> Flipbook
              </small>
              <b>{item.nome}</b>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginTop: "8px",
                }}
              >
                {item.url ? (
                  <a
                    className="btn btn-deep btn-sm"
                    href={item.url}
                    target="_blank"
                    rel="noopener"
                  >
                    Folhear
                  </a>
                ) : (
                  <Link className="btn btn-deep btn-sm" href="/catalogos">
                    Folhear
                  </Link>
                )}
                <CompartilharCatalogo url={compartilharUrl} titulo={item.nome} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
