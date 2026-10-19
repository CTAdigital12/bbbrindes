import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/content";
import { img } from "@/lib/asset";
import Icon from "@/components/Icon";
import { POSTS } from "@/data/home-joy";

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

// Capas ilustrativas (mockup POSTS), consistentes com o index do blog.
const COVERS = POSTS.map(([, , imagem]) => imagem);

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const idx = Math.max(0, posts.findIndex((p) => p.slug === slug));
  const cover = COVERS[idx % COVERS.length];

  return (
    <article className="wrap">
      <div className="crumb">
        <Link href="/">Início</Link>/<Link href="/blog">Blog</Link>/<span>{post.titulo}</span>
      </div>
      <div className="ptitle">
        <h1>{post.titulo}</h1>
        <p style={{ margin: "8px 0 0", color: "var(--muted)", fontSize: "13px" }}>
          {new Date(post.data).toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div
        style={{
          borderRadius: "var(--r)",
          overflow: "hidden",
          aspectRatio: "16 / 7",
          marginTop: "18px",
          background: "var(--g-card)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img(cover)}
          alt=""
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <div
        style={{
          maxWidth: "72ch",
          marginTop: "24px",
          color: "#33473e",
          fontSize: "15px",
          lineHeight: 1.7,
        }}
      >
        <p style={{ fontWeight: 500, color: "var(--ink)", margin: "0 0 14px" }}>{post.resumo}</p>
        <p style={{ margin: 0 }}>{post.conteudo}</p>
      </div>

      <Link className="link" href="/blog" style={{ marginTop: "28px", display: "inline-flex" }}>
        <Icon name="chevron-left" />
        Voltar ao blog
      </Link>
    </article>
  );
}
