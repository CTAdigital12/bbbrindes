/** @type {import('next').NextConfig} */

// Deploy padrao (Vercel): Next nativo, servido na raiz, pronto para SSR nas
// proximas sprints. O export estatico so e ligado quando STATIC_EXPORT=true
// (ex.: hospedagem estatica tipo GitHub Pages), com basePath opcional.
const staticExport = process.env.STATIC_EXPORT === "true";
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  ...(staticExport ? { output: "export", trailingSlash: true } : {}),
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
