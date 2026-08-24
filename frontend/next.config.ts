import type { NextConfig } from "next";

/**
 * Build de export estatico para GitHub Pages (repo `jardimdesoftware.github.io`,
 * um user/org site — publicado na raiz do dominio, sem basePath/assetPrefix).
 *
 * GitHub Pages so serve arquivos estaticos (sem runtime Node), entao:
 *  - `output: "export"` gera HTML/CSS/JS estaticos em `frontend/out/` via
 *    `next build` (sem `next start`/servidor).
 *  - `images.unoptimized: true` desliga a API de otimizacao de imagens do
 *    `next/image` (`/_next/image`), que depende de um servidor Node e nao
 *    existe em export estatico.
 *  - `trailingSlash: true` faz cada rota virar `<rota>/index.html` (em vez
 *    de `<rota>.html`), que e o formato servido de forma mais confiavel por
 *    servidores de arquivo estatico "burros" como o GitHub Pages (qualquer
 *    host estatico resolve `/rota/` para `/rota/index.html` por padrao).
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
