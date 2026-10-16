// Prefixa assets locais (public/img) com o basePath do deploy. No GitHub Pages o
// site fica sob /bbbrindes (NEXT_PUBLIC_BASE_PATH); em dominio proprio fica vazio.
// Use img("/img/...") em TODA referencia a asset local. NAO prefixe URLs
// absolutas (http...), que ja vem completas do Payload.
export function img(p: string): string {
  const bp = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const s = p.startsWith("/") ? p : "/" + p;
  return bp + s;
}

// Resolve a origem de uma imagem de produto: asset local (prefixa basePath) ou
// URL absoluta do Payload (usada como veio).
export function imgSrc(p?: string): string {
  if (!p) return "";
  return /^https?:\/\//.test(p) ? p : img(p);
}
