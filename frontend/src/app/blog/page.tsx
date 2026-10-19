import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/content";
import { img } from "@/lib/asset";
import { nb, POSTS } from "@/data/home-joy";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Conteúdo sobre brindes corporativos para quem compra: como escolher produto por ocasião, fabricante x revendedor e o que exigir de um fornecedor.",
};

// Capas ilustrativas (imagens do mockup POSTS), cicladas sobre os posts reais:
// o Post (getPosts) nao tem imagem no wireframe. Espelha o blogHTML do mockup.
const COVERS = POSTS.map(([, , imagem]) => imagem);

// Espelha blog() (.blog). Dado REAL: getPosts() (Payload com fallback no mock
// data/blog). Cada post linka para /blog/[slug], que tem generateStaticParams.
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
      <div className="blog">
        {posts.map((p, i) => (
          <Link className="post" href={`/blog/${p.slug}`} key={p.slug}>
            <div className="ph">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(COVERS[i % COVERS.length])} alt="" loading="lazy" />
            </div>
            <div className="bd">
              <span className="chip chip-sage" style={{ alignSelf: "flex-start" }}>
                Artigo
              </span>
              <h3>{nb(p.titulo)}</h3>
              <p>{p.resumo}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
