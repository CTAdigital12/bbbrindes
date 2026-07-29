import type { MetadataRoute } from "next";
import { pageUrl, assetUrl } from "@/lib/site";

// Rota de metadata estatica: exigido pelo output: export do Next.
export const dynamic = "force-static";

// robots.txt do site (S03-07). Libera o catalogo e as paginas institucionais e
// bloqueia as rotas funcionais/privadas: carrinho de orcamento, painel de
// gestao e area do revendedor. Aponta para o sitemap. Gerado no build.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Barra final em /revendedor/ para nao bloquear a pagina publica
      // /revendedores/ (match por prefixo no robots).
      allow: "/",
      disallow: ["/orcamento/", "/gestao/", "/revendedor/"],
    },
    sitemap: assetUrl("/sitemap.xml"),
    host: pageUrl("/"),
  };
}
