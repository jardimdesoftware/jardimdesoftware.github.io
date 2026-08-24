import type { Metadata } from "next";

import { TeamRoster } from "./_components/TeamRoster";

export const metadata: Metadata = {
  title: "Equipe — Jardim de Software",
  description:
    "Docentes e discentes do Jardim de Software, IFPE Campus Belo Jardim, atuando em ensino, extensão, pesquisa e inovação.",
};

// Export estatico (GitHub Pages): sem prefetch/HydrationBoundary - o
// `<TeamRoster />` ja e Client Component e busca os dados via useQuery.
export default function EquipePage() {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold text-brand-text sm:text-4xl">
            Equipe
          </h1>
          <p className="mt-2 text-brand-muted">
            Docentes e discentes atuando na concepção, desenvolvimento e
            transferência de tecnologia.
          </p>
        </div>

        <TeamRoster />
      </div>
    </section>
  );
}
