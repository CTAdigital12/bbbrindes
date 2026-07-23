// Identidade e URL base do site, usadas pelo SEO estrutural (S03-07): sitemap,
// robots, canonical, Open Graph e JSON-LD. O origin vem de NEXT_PUBLIC_SITE_URL
// e o basePath (/<repo> no GitHub Pages) de NEXT_PUBLIC_BASE_PATH, ambos
// injetados em next.config.mjs. Em producao, definir NEXT_PUBLIC_SITE_URL com o
// dominio real e deixar o basePath vazio.

const ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL || "https://ctadigital12.github.io").replace(/\/+$/, "");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

// URL absoluta da raiz do site, ja com o basePath.
export const SITE_URL = `${ORIGIN}${BASE_PATH}`;

export const SITE_NAME = "BB Brindes";
export const SITE_DESCRIPTION =
  "Catalogo B2B de brindes corporativos personalizados: copos, canecas, squeezes e mais, com orcamento rapido e area de revendedor.";

// URL absoluta de uma pagina. Mantem a barra final (trailingSlash do Next) para
// bater com a URL real e evitar redirect/duplicidade.
export function pageUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const withSlash = clean === "/" ? "/" : clean.endsWith("/") ? clean : `${clean}/`;
  return `${SITE_URL}${withSlash === "/" ? "/" : withSlash}`;
}

// URL absoluta de um recurso (arquivo), sem forcar barra final.
export function assetUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}
