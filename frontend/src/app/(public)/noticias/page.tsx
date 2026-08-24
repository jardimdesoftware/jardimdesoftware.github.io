import type { Metadata } from "next";
import { Suspense } from "react";

import { NoticiasContent } from "./_components/NoticiasContent";

export const metadata: Metadata = {
  title: "Notícias — Jardim de Software",
  description:
    "Reconhecimentos, menções na mídia e comunicados oficiais do Jardim de Software, IFPE Campus Belo Jardim.",
};

// Export estatico (GitHub Pages): sem prefetch/HydrationBoundary. A leitura
// de `?page=` e a busca dos dados acontecem no cliente, dentro de
// `<NoticiasContent />` (useSearchParams exige um limite de Suspense).
export default function NoticiasPage() {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold text-brand-text sm:text-4xl">
            Notícias
          </h1>
          <p className="mt-2 text-brand-muted">
            Reconhecimentos, menções na mídia e comunicados oficiais.
          </p>
        </div>

        <Suspense fallback={null}>
          <NoticiasContent />
        </Suspense>
      </div>
    </section>
  );
}
