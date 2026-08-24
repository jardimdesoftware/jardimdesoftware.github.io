import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { StaticSlugRouter } from "@/components/StaticSlugRouter";

/**
 * Layout do site publico (landing + /projetos, /equipe, /noticias,
 * /publicacoes). Isolado em um route group `(public)` para que a area
 * administrativa (`/admin/*`, fora deste grupo) NAO herde a navbar/footer
 * publicos - ela usa seu proprio shell com sidebar (ver src/app/admin).
 *
 * `<StaticSlugRouter>` envolve `children` para resolver as rotas de
 * detalhe (/projetos/:slug, /equipe/:slug, /noticias/:slug) no cliente -
 * ver o comentario em src/components/StaticSlugRouter.tsx para o porque
 * (export estatico + conteudo dinamico sem rebuild).
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNavbar />
      <main>
        <StaticSlugRouter>{children}</StaticSlugRouter>
      </main>
      <LandingFooter />
    </>
  );
}
