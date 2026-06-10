import type { Post } from "@/lib/types";

// Posts mockados. Gestao via CMS (Payload) entra na Sprint 5.
export const posts: Post[] = [
  {
    slug: "brindes-sustentaveis-tendencias",
    titulo: "Brindes sustentaveis: tendencias para 2026",
    resumo:
      "Como a pegada ecologica virou criterio de compra no mercado corporativo e quais materiais lideram.",
    data: "2026-05-20",
    conteudo:
      "Conteudo de exemplo do post. Na producao, este texto vem do CMS e suporta imagens, listas e SEO por post.",
  },
  {
    slug: "datas-comemorativas-planejamento",
    titulo: "Datas comemorativas: como planejar suas campanhas de brinde",
    resumo:
      "Um calendario comercial para nao perder as principais datas e antecipar a producao de brindes.",
    data: "2026-04-10",
    conteudo:
      "Conteudo de exemplo do post. Na producao, este texto vem do CMS e suporta imagens, listas e SEO por post.",
  },
  {
    slug: "personalizacao-que-converte",
    titulo: "Personalizacao que converte: boas praticas de marca",
    resumo:
      "Dicas para escolher cores, materiais e tecnicas de gravacao que valorizam a marca no brinde.",
    data: "2026-03-02",
    conteudo:
      "Conteudo de exemplo do post. Na producao, este texto vem do CMS e suporta imagens, listas e SEO por post.",
  },
];

export function postPorSlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
