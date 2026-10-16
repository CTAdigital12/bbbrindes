import Link from "next/link";
import type { Produto } from "@/lib/types";
import { imgSrc } from "@/lib/asset";
import { nomeCategoria } from "@/data/categorias";
import { nb } from "@/data/home-joy";

// Card de produto na identidade da Joy, espelhando a .card do mockup: painel de
// imagem com fundo var(--g-card), nome, categoria (eyebrow) e swatches de cor.
// O quick-add (.qa) e o quickview (.qv) do mockup ficam de fora por ora (entram
// na fase do catalogo); aqui o foco e o visual do card. Dado REAL do Payload.
export default function ProductCardJoy({ produto }: { produto: Produto }) {
  const src = imgSrc(produto.imagens?.[0]);
  const categoria = produto.categoria ? nomeCategoria(produto.categoria) : "";
  const eco = (produto.tags ?? []).includes("ecologico");
  const novo = (produto.destaques ?? []).includes("lancamento");
  const cores = produto.cores ?? [];
  const href = `/produto/${produto.slug}`;

  return (
    <article className="card">
      <div className="phw">
        <Link href={href} className="ph" aria-label={produto.nome}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={produto.nome} loading="lazy" />
          ) : null}
        </Link>
        {(novo || eco) && (
          <div className="tags">
            {novo && <span className="chip chip-orange">Novo</span>}
            {eco && <span className="chip chip-sage">Ecológico</span>}
          </div>
        )}
      </div>
      <div className="bd">
        {categoria && <span className="ln">{categoria}</span>}
        <h3>
          <Link href={href}>{nb(produto.nome)}</Link>
        </h3>
        <div className="meta">
          <div className="sw">
            {cores.slice(0, 5).map((c) => (
              <i key={c.nome} style={{ background: c.hex }} />
            ))}
            {cores.length > 5 && (
              <small style={{ fontSize: "11px", color: "var(--muted)" }}>
                +{cores.length - 5}
              </small>
            )}
          </div>
          <span className="min">mín. 500 un.</span>
        </div>
      </div>
    </article>
  );
}
