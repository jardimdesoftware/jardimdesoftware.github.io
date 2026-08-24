import type { Metadata } from "next";

import { ProjectsGrid } from "./_components/ProjectsGrid";

export const metadata: Metadata = {
  title: "Projetos — Jardim de Software",
  description:
    "Conheça os projetos de desenvolvimento, extensão, pesquisa e inovação do Jardim de Software, IFPE Campus Belo Jardim.",
};

// Export estatico (GitHub Pages): sem prefetch/HydrationBoundary - o
// `<ProjectsGrid />` ja e Client Component e busca os dados via useQuery.
export default function ProjetosPage() {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold text-brand-text sm:text-4xl">
            Projetos
          </h1>
          <p className="mt-2 text-brand-muted">
            Soluções desenvolvidas, projetos de extensão, pesquisa e
            inovação do Jardim de Software.
          </p>
        </div>

        <ProjectsGrid />
      </div>
    </section>
  );
}
