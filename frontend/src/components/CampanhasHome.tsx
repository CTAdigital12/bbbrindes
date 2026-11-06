import Link from "next/link";
import type { Campanha } from "@/data/campanhas";
import { imgSrc } from "@/lib/asset";
import { imagemCampanha, ordenarCampanhas } from "@/lib/campanhas-vitrine";

export default function CampanhasHome({ campanhas, monthIdx }: {
  campanhas: Campanha[]; monthIdx: number;
}) {
  if (campanhas.length === 0) return null;
  const ordenadas = ordenarCampanhas(campanhas, monthIdx);
  return (
    <section className="sec reveal">
      <div className="wrap">
        <div className="shead"><div>
          <h2>Campanhas e datas</h2>
          <p>Cada data tem uma página com os brindes mais pedidos. O pedido sai melhor quando fecha com 40 a 60 dias de antecedência.</p>
        </div></div>
        <div className="tgrid6">
          {ordenadas.map((campanha, index) => {
            const imagem = imagemCampanha(campanha);
            return (
              <Link className="tile" href={`/campanha/${campanha.slug}`} key={campanha.slug}
                style={!imagem ? { backgroundColor: "#004431" } : undefined}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {imagem ? <img src={imgSrc(imagem)} alt="" loading="lazy" /> : null}
                <span className="lb">{campanha.nome}</span>
                {index > 0 && index < 3 ? <span className="nx">PRÓXIMA</span> : null}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
