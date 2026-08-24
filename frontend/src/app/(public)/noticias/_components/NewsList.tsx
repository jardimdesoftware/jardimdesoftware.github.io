"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useNewsPaginated } from "@/hooks/queries/useNews";
import { Button } from "@/components/ui/button";

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function NewsList({ page, limit }: { page: number; limit: number }) {
  const { data, isLoading } = useNewsPaginated({ page, limit });

  if (isLoading) {
    return (
      <div className="relative mx-auto mt-12 max-w-2xl border-l-2 border-slate-200 pl-6">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="relative mb-5">
            <span className="absolute -left-[31px] top-2 h-3.5 w-3.5 rounded-full bg-slate-300" />
            <div className="h-20 animate-pulse rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  const news = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (news.length === 0) {
    return (
      <p className="mt-12 text-center text-brand-muted">
        Nenhuma notícia publicada até o momento.
      </p>
    );
  }

  return (
    <>
      <div className="relative mx-auto mt-12 max-w-2xl border-l-2 border-slate-200 pl-6">
        {news.map((post) => (
          <article key={post.id} className="relative mb-5">
            <span className="absolute -left-[31px] top-2 h-3.5 w-3.5 rounded-full bg-brand-gradient shadow-[0_0_0_4px_#EAF3FF]" />
            {/* <a> normal (nao next/link): /noticias/:slug e resolvida no
                cliente por StaticSlugRouter, nao existe como pagina
                pre-gerada - precisa de navegacao completa para passar pelo
                fallback do 404.html. Ver src/components/StaticSlugRouter.tsx. */}
            <a
              href={`/noticias/${post.slug}/`}
              className="block rounded-xl border border-brand-border bg-white p-4 shadow-[0_10px_30px_rgba(30,136,229,0.08)] transition-shadow hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-brand-blue">
                {formatDate(post.publishedAt)}
              </p>
              <h2 className="mt-1 font-bold text-brand-text">{post.title}</h2>
              <p className="mt-1 text-sm text-brand-muted">{post.excerpt}</p>
            </a>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          {page <= 1 ? (
            <span className="pointer-events-none inline-flex items-center gap-2 rounded-md border-2 border-primary/30 px-4 py-2 text-sm font-semibold text-primary opacity-50">
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </span>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href={`/noticias?page=${page - 1}`}>
                <ArrowLeft className="h-4 w-4" />
                Anterior
              </Link>
            </Button>
          )}
          <span className="text-sm font-semibold text-brand-muted">
            Página {page} de {totalPages}
          </span>
          {page >= totalPages ? (
            <span className="pointer-events-none inline-flex items-center gap-2 rounded-md border-2 border-primary/30 px-4 py-2 text-sm font-semibold text-primary opacity-50">
              Próxima
              <ArrowRight className="h-4 w-4" />
            </span>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href={`/noticias?page=${page + 1}`}>
                Próxima
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      )}
    </>
  );
}
