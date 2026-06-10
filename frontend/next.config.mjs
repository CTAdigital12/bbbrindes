/** @type {import('next').NextConfig} */

// Em GitHub Pages o site fica sob /<repo>. O basePath vem por env no CI.
// Em dev/local (sem a env) o site roda na raiz normalmente.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  // Export estatico: gera HTML/CSS/JS prontos para hospedar no Pages.
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  // Expoe o basePath para o client (links/wa.me e assets manuais, se preciso).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
