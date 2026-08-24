"use client";

import { useEffect } from "react";

/**
 * Pagina 404 do Next. No export estatico, o Next escreve a saida desta
 * rota especial em `out/404.html` - exatamente o arquivo que o GitHub
 * Pages procura para QUALQUER caminho sem arquivo correspondente
 * (sobrescreveria um `public/404.html` estatico, entao a logica de
 * redirect precisa morar aqui).
 *
 * O site tem rotas de conteudo dinamico sem arquivo estatico proprio
 * (/projetos/:slug, /equipe/:slug, /noticias/:slug - o slug so e
 * conhecido em runtime, via o backend, e o conteudo muda pelo painel
 * admin sem disparar rebuild). Para essas rotas "funcionarem" com hard
 * refresh num host puramente estatico, aplicamos o truque padrao
 * "SPA on GitHub Pages" (rafgraph/spa-github-pages): codifica o caminho
 * original numa query string e redireciona para a raiz do site, onde
 * `<StaticSlugRouter>` (montado no layout publico) restaura a URL via
 * `history.replaceState` e renderiza o conteudo certo no cliente.
 *
 * Para uma URL genuinamente inexistente (nao bate com nenhum dos tres
 * padroes acima), `<StaticSlugRouter>` simplesmente renderiza a home -
 * e a troca aceita deste truque (nao ha rota de servidor para diferenciar
 * "slug desconhecido" de "URL invalida" sem consultar o backend).
 */
export default function NotFound() {
  useEffect(() => {
    const l = window.location;
    const segmentsToKeep = 0;

    const encodedPath = l.pathname
      .slice(1)
      .split("/")
      .slice(segmentsToKeep)
      .join("/")
      .replace(/&/g, "~and~");

    const encodedSearch = l.search
      ? "&q=" + l.search.slice(1).replace(/&/g, "~and~")
      : "";

    const redirectUrl =
      l.protocol +
      "//" +
      l.hostname +
      (l.port ? ":" + l.port : "") +
      l.pathname
        .split("/")
        .slice(0, 1 + segmentsToKeep)
        .join("/") +
      "/?p=" +
      encodedPath +
      encodedSearch +
      l.hash;

    l.replace(redirectUrl);
  }, []);

  return null;
}
