import { readFileSync } from "node:fs";

/** @type {import('next').NextConfig} */

// Versao do app (SemVer), lida do package.json e exposta ao client.
const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

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
  // Expoe basePath e versao para o client (links/wa.me, rodape).
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },
};

export default nextConfig;
