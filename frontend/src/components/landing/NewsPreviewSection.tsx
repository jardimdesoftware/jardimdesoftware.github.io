"use client";

import { useNews } from "@/hooks/queries/useNews";
import { Reveal } from "@/components/landing/Reveal";

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function NewsPreviewSection() {
  const { data: news, isLoading } = useNews({ page: 1, limit: 4 });

  if (!isLoading && (!news || news.length === 0)) {
    return null;
  }

  return (
    <section id="noticias" className="py-16 md:py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-brand-text">
            Notícias
          </h2>
          <p className="mt-2 text-brand-muted">
            Reconhecimentos, menções na mídia e comunicados oficiais.
          </p>
        </Reveal>

        <Reveal className="relative mx-auto mt-12 max-w-2xl border-l-2 border-slate-200 pl-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="relative mb-5">
                  <span className="absolute -left-[31px] top-2 h-3.5 w-3.5 rounded-full bg-slate-300" />
                  <div className="h-20 animate-pulse rounded-xl bg-slate-200" />
                </div>
              ))
            : news!.map((post) => (
                <article key={post.id} className="relative mb-5">
                  <span className="absolute -left-[31px] top-2 h-3.5 w-3.5 rounded-full bg-brand-gradient shadow-[0_0_0_4px_#EAF3FF]" />
                  <div className="rounded-xl border border-brand-border bg-white p-4 shadow-[0_10px_30px_rgba(30,136,229,0.08)]">
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-blue">
                      {formatDate(post.publishedAt)}
                    </p>
                    <h3 className="mt-1 font-bold text-brand-text">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-sm text-brand-muted">
                      {post.excerpt}
                    </p>
                  </div>
                </article>
              ))}
        </Reveal>
      </div>
    </section>
  );
}
