import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/content";
import { img } from "@/lib/asset";
import { pageUrl } from "@/lib/site";
import Icon from "@/components/Icon";
import { nb, POSTS } from "@/data/home-joy";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post nao encontrado" };
  return { title: post.titulo, description: post.resumo };
}

// Capas ilustrativas (mockup POSTS), consistentes com o index do blog. O Post
// ainda nao tem campo de imagem no wireframe; ciclamos as capas por indice.
const COVERS = POSTS.map(([, , imagem]) => imagem);

// Data por extenso em pt-BR (ex.: "20 de maio de 2026"), padrao de blog.
function dataLonga(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Tempo de leitura estimado a 200 palavras/min (minimo de 1 min).
function tempoLeitura(texto: string): number {
  const palavras = texto.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 200));
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const posts = await getPosts();
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) notFound();
  const post = posts[idx];
  const cover = COVERS[idx % COVERS.length];
  // Quebra o conteudo em paragrafos (mesmo criterio da campanha): um <p> por
  // bloco separado por linha em branco. Antes tudo caia em um unico <p>.
  const paragrafos = post.conteudo ? post.conteudo.split("\n\n").filter(Boolean) : [];
  const minutos = tempoLeitura(post.conteudo || post.resumo || "");

  // Continue lendo: ate 3 outros posts, em ordem, pulando o atual.
  const relacionados = posts.filter((p) => p.slug !== slug).slice(0, 3);

  // Links de compartilhamento (sem JS, funcionam no export estatico). A URL
  // absoluta vem de pageUrl (origin + basePath), a mesma base do SEO/canonical.
  const url = pageUrl(`/blog/${slug}`);
  const share = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${post.titulo} ${url}`)}`,
  };

  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<Link href="/blog">Blog</Link>/<span>{post.titulo}</span>
      </div>

      <article className="article">
        <div className="ptitle">
          <span className="chip chip-sage" style={{ marginBottom: "12px" }}>
            Artigo
          </span>
          <h1>{nb(post.titulo)}</h1>
          <div className="article-meta">
            <span className="mi">
              <Icon name="calendar-event" />
              {dataLonga(post.data)}
            </span>
            <span className="mi">
              <Icon name="clock" />
              {minutos} min de leitura
            </span>
          </div>
        </div>

        <div className="article-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(cover)} alt="" loading="eager" />
        </div>

        {post.resumo ? <p className="article-lead">{nb(post.resumo)}</p> : null}

        <div className="article-body">
          {paragrafos.map((par, i) => (
            <p key={i}>{par}</p>
          ))}
        </div>
      </article>

      <div className="article-foot">
        <Link className="link" href="/blog">
          <Icon name="chevron-left" />
          Voltar ao blog
        </Link>
        <div className="share">
          <span>Compartilhar:</span>
          <a href={share.facebook} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no Facebook">
            <Icon name="brand-facebook" />
          </a>
          <a href={share.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no LinkedIn">
            <Icon name="brand-linkedin" />
          </a>
          <a href={share.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no WhatsApp">
            <Icon name="brand-whatsapp" />
          </a>
        </div>
      </div>

      {relacionados.length > 0 ? (
        <section className="sec">
          <div className="shead">
            <div>
              <h2>Continue lendo</h2>
            </div>
            <Link className="link" href="/blog">
              Ver todos os posts
              <Icon name="arrow-right" />
            </Link>
          </div>
          <div className="blog">
            {relacionados.map((p) => {
              const ci = posts.findIndex((x) => x.slug === p.slug);
              return (
                <Link className="post" href={`/blog/${p.slug}`} key={p.slug}>
                  <div className="ph">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img(COVERS[ci % COVERS.length])} alt="" loading="lazy" />
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
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
