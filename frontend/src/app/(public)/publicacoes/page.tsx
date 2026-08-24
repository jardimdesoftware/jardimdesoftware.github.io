import type { Metadata } from "next";

import { PublicationsList } from "./_components/PublicationsList";

export const metadata: Metadata = {
  title: "Publicações — Jardim de Software",
  description:
    "Artigos, trabalhos e publicações produzidos pelo Jardim de Software, IFPE Campus Belo Jardim.",
};

// Export estatico (GitHub Pages): sem prefetch/HydrationBoundary - o
// `<PublicationsList />` ja e Client Component e busca os dados via useQuery.
export default function PublicacoesPage() {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold text-brand-text sm:text-4xl">
            Publicações
          </h1>
          <p className="mt-2 text-brand-muted">
            Artigos, trabalhos e publicações produzidos pela nossa equipe.
          </p>
        </div>

        <PublicationsList />
      </div>
    </section>
  );
}
