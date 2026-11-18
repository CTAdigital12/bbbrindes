import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/content";
import { img } from "@/lib/asset";
import { nb, POSTS } from "@/data/home-joy";
import Icon from "@/components/Icon";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Conteúdo sobre brindes corporativos para quem compra: como escolher produto por ocasião, fabricante x revendedor e o que exigir de um fornecedor.",
};

// Capas ilustrativas (imagens do mockup POSTS), cicladas sobre os posts reais: o
// Post (getPosts) ainda nao tem campo de imagem no wireframe. Quando o CMS passar
// a mandar capa por post, basta trocar COVERS[i] pela imagem do proprio post.
const COVERS = POSTS.map(([, , imagem]) => imagem);

// Data por extenso em pt-BR (ex.: "20 de maio de 2026"). Formato padrao de blog.
function dataLonga(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Espelha blog() (.blog). Dado REAL: getPosts() (Payload com fallback no mock
// data/blog). Cada post linka para /blog/[slug], que tem generateStaticParams.
// Layout de blog padrao: primeiro post em destaque (card largo) e os demais numa
// grade de cartoes com capa, data, chip de categoria, titulo e resumo.
export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<span>Blog</span>
      </div>
      <div className="ptitle">
        <h1>Blog da BB Brindes</h1>
        <p>
          Conteúdo sobre brindes corporativos para quem compra: como escolher produto por ocasião, o
          que muda entre fabricante e revendedor e o que exigir de um fornecedor.
        </p>
      </div>
      <div className="blog" style={{ marginTop: "22px" }}>
        {posts.map((p, i) => (
          <Link
            className={`post${i === 0 ? " post-featured" : ""}`}
            href={`/blog/${p.slug}`}
            key={p.slug}
          >
            <div className="ph">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(COVERS[i % COVERS.length])} alt="" loading={i === 0 ? "eager" : "lazy"} />
            </div>
            <div className="bd">
              <span className="chip chip-sage" style={{ alignSelf: "flex-start" }}>
                Artigo
              </span>
              <h3>{nb(p.titulo)}</h3>
              <p>{p.resumo}</p>
              <span className="meta">
                <Icon name="calendar-event" />
                {dataLonga(p.data)}
              </span>
              <span className="more">
                Ler mais
                <Icon name="arrow-right" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
