import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Conteudos sobre brindes, sustentabilidade, datas comemorativas e personalizacao.",
};

export default function BlogPage() {
  return (
    <div className="wf-container py-8">
      <h1 className="text-2xl font-bold text-wf-ink">Blog</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="wf-card overflow-hidden hover:shadow-md">
            <div className="wf-img aspect-[16/9] w-full">Imagem</div>
            <div className="p-4">
              <span className="text-xs text-wf-muted">
                {new Date(p.data).toLocaleDateString("pt-BR")}
              </span>
              <h2 className="mt-1 text-sm font-medium text-wf-ink">{p.titulo}</h2>
              <p className="mt-1 line-clamp-3 text-xs text-wf-text">{p.resumo}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
