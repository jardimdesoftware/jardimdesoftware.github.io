"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { ProjectDetailView } from "@/components/detail/ProjectDetailView";
import { MemberDetailView } from "@/components/detail/MemberDetailView";
import { NewsDetailView } from "@/components/detail/NewsDetailView";

type Resolved =
  | { kind: "project"; slug: string }
  | { kind: "member"; slug: string }
  | { kind: "news"; slug: string }
  | null;

function resolveFromPath(pathname: string): Resolved {
  let match = pathname.match(/^\/projetos\/([^/]+)\/?$/);
  if (match) return { kind: "project", slug: decodeURIComponent(match[1]) };

  match = pathname.match(/^\/equipe\/([^/]+)\/?$/);
  if (match) return { kind: "member", slug: decodeURIComponent(match[1]) };

  match = pathname.match(/^\/noticias\/([^/]+)\/?$/);
  if (match) return { kind: "news", slug: decodeURIComponent(match[1]) };

  return null;
}

/**
 * Resolve as rotas de detalhe (`/projetos/:slug`, `/equipe/:slug`,
 * `/noticias/:slug`) inteiramente no cliente, sem depender de rotas
 * dinamicas do Next (`app/.../[slug]`).
 *
 * Por que: no export estatico (`output: "export"`), toda rota dinamica
 * precisa de `generateStaticParams()` retornando pelo menos 1 slug em
 * build time - mas os slugs mudam via painel admin sem disparar rebuild,
 * entao pre-renderizar uma lista fixa deixaria conteudo novo/editado
 * inacessivel ate o proximo deploy. Em vez disso:
 *
 *   1. `frontend/public/404.html` (copiado para `out/404.html`) e servido
 *      pelo GitHub Pages para QUALQUER caminho sem arquivo correspondente
 *      (inclusive `/projetos/<slug>/`, que nunca existe como arquivo
 *      estatico). Ele redireciona para `/?p=<caminho original>` - o
 *      truque padrao "SPA on GitHub Pages" (rafgraph/spa-github-pages).
 *   2. Este componente, montado no layout publico (sempre presente,
 *      porque o redirect sempre cai na raiz `/`), le `?p=`, restaura a URL
 *      original via `history.replaceState` (sem reload) e renderiza a
 *      view de detalhe correspondente no lugar do `children` normal da
 *      rota - usando os mesmos hooks React Query (`useProject`,
 *      `useTeamMember`, `useNewsPost`) que buscam o conteudo atual do
 *      backend.
 *
 * Navegacao real do Next (clique em `<Link>` para uma rota estatica
 * existente, ex. "/projetos") sempre invalida essa "pagina virtual" e
 * volta a confiar no `children` normal - ver o efeito que observa
 * `usePathname()`.
 */
export function StaticSlugRouter({
  children,
}: {
  children: React.ReactNode;
}) {
  const [resolved, setResolved] = useState<Resolved>(null);
  const initialized = useRef(false);
  const nextPathname = usePathname();
  const firstNextPathname = useRef(nextPathname);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const search = new URLSearchParams(window.location.search);
    const encodedPath = search.get("p");

    let next: Resolved;
    if (encodedPath != null) {
      const restoredSearch = search.get("q");
      const restoredPath =
        "/" +
        encodedPath.replace(/~and~/g, "&") +
        (restoredSearch ? `?${restoredSearch.replace(/~and~/g, "&")}` : "");
      window.history.replaceState(
        null,
        "",
        restoredPath + window.location.hash,
      );
      next = resolveFromPath("/" + encodedPath.replace(/~and~/g, "&"));
    } else {
      // Sem `?p=` (nao veio de um redirect do 404.html): ainda assim checa
      // o pathname atual, cobrindo o caso raro de um host estatico que
      // serve `/projetos/<slug>/index.html` diretamente sem passar pelo
      // 404.
      next = resolveFromPath(window.location.pathname);
    }

    // Adia o setState para depois do commit do efeito (em vez de chamar
    // sincronamente no corpo do efeito) - evita o re-render em cascata que
    // `react-hooks/set-state-in-effect` sinaliza; aqui e apenas 1 update
    // pontual de bootstrap (leitura de `window`, indisponivel durante o
    // render estatico/SSG), nao um loop de sincronizacao.
    queueMicrotask(() => setResolved(next));
  }, []);

  useEffect(() => {
    if (nextPathname !== firstNextPathname.current) {
      // O Next navegou de verdade (ex.: <Link href="/projetos">) - a
      // "pagina virtual" nao se aplica mais.
      setResolved(null);
    }
  }, [nextPathname]);

  if (!resolved) return <>{children}</>;

  switch (resolved.kind) {
    case "project":
      return <ProjectDetailView slug={resolved.slug} />;
    case "member":
      return <MemberDetailView slug={resolved.slug} />;
    case "news":
      return <NewsDetailView slug={resolved.slug} />;
    default:
      return <>{children}</>;
  }
}
