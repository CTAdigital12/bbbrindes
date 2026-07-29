import type { MetadataRoute } from "next";
import { produtos } from "@/data/produtos";
import { campanhas } from "@/data/campanhas";
import { posts } from "@/data/blog";
import { pageUrl } from "@/lib/site";

// Rota de metadata estatica: exigido pelo output: export do Next.
export const dynamic = "force-static";

// Sitemap do site (S03-07). Lista so as rotas publicas e indexaveis. Ficam de
// fora as paginas funcionais/privadas (orcamento, gestao, area do revendedor),
// que tambem estao bloqueadas no robots.ts. Gerado estaticamente no build
// (output: export).
export default function sitemap(): MetadataRoute.Sitemap {
  const estaticas: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/catalogo", priority: 0.9, freq: "weekly" },
    { path: "/catalogos", priority: 0.7, freq: "monthly" },
    { path: "/quem-somos", priority: 0.6, freq: "yearly" },
    { path: "/revendedores", priority: 0.6, freq: "monthly" },
    { path: "/blog", priority: 0.6, freq: "weekly" },
    { path: "/cases", priority: 0.5, freq: "monthly" },
    { path: "/imprensa", priority: 0.4, freq: "monthly" },
    { path: "/contato", priority: 0.5, freq: "yearly" },
    { path: "/sac", priority: 0.4, freq: "yearly" },
  ];

  const paginas: MetadataRoute.Sitemap = estaticas.map((r) => ({
    url: pageUrl(r.path),
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  const dinamicas: MetadataRoute.Sitemap = [
    ...produtos.map((p) => ({
      url: pageUrl(`/produto/${p.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...campanhas.map((c) => ({
      url: pageUrl(`/campanha/${c.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: pageUrl(`/blog/${post.slug}`),
      lastModified: post.data,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];

  return [...paginas, ...dinamicas];
}
