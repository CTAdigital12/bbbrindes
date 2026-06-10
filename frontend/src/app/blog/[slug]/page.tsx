import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { postPorSlug, posts } from "@/data/blog";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = postPorSlug(slug);
  if (!post) return { title: "Post nao encontrado" };
  return { title: post.titulo, description: post.resumo };
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = postPorSlug(slug);
  if (!post) notFound();

  return (
    <article className="wf-container py-8">
      <Link href="/blog" className="text-sm text-wf-accent hover:underline">
        Voltar ao blog
      </Link>
      <h1 className="mt-3 text-3xl font-bold text-wf-ink">{post.titulo}</h1>
      <span className="mt-1 block text-xs text-wf-muted">
        {new Date(post.data).toLocaleDateString("pt-BR")}
      </span>
      <div className="wf-img mt-6 aspect-[16/7] w-full rounded-lg">Imagem de capa</div>
      <div className="prose mt-6 max-w-none text-sm text-wf-text">
        <p className="font-medium text-wf-ink">{post.resumo}</p>
        <p className="mt-4">{post.conteudo}</p>
      </div>
    </article>
  );
}
