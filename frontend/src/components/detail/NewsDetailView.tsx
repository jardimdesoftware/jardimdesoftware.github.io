"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useNewsPost } from "@/hooks/queries/useNews";

function formatDate(value: string | null) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function NewsDetailView({ slug }: { slug: string }) {
  // Export estatico: nao ha mais hidratacao vinda do servidor - o dado e
  // buscado aqui mesmo, no cliente, via useQuery (useNewsPost).
  const { data: post, isLoading, isError } = useNewsPost(slug);

  if (isLoading) {
    return (
      <article className="py-16 md:py-20">
        <div className="container max-w-3xl animate-pulse space-y-4">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="h-56 w-full rounded-2xl bg-slate-200" />
          <div className="h-8 w-2/3 rounded bg-slate-200" />
          <div className="h-24 w-full rounded bg-slate-200" />
        </div>
      </article>
    );
  }

  if (isError || !post) {
    return (
      <article className="py-16 md:py-20">
        <div className="container max-w-3xl text-center">
          <h1 className="text-2xl font-extrabold text-brand-text">
            Notícia não encontrada
          </h1>
          <p className="mt-2 text-brand-muted">
            A notícia que você está procurando não existe ou foi removida.
          </p>
          <Link
            href="/noticias"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Notícias
          </Link>
        </div>
      </article>
    );
  }

  const paragraphs = post.body
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="py-16 md:py-20">
      <div className="container max-w-3xl">
        <Link
          href="/noticias"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Notícias
        </Link>

        {post.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="mt-6 h-auto w-full rounded-2xl border border-brand-border object-cover"
          />
        )}

        <p className="mt-6 text-xs font-bold uppercase tracking-wide text-brand-blue">
          {formatDate(post.publishedAt)}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-brand-text sm:text-4xl">
          {post.title}
        </h1>

        {post.author && (
          // <a> normal (nao next/link): ver comentario equivalente em
          // components/detail/ProjectDetailView.tsx.
          <a
            href={`/equipe/${post.author.slug}/`}
            className="mt-3 inline-block text-sm font-semibold text-brand-muted hover:text-brand-blue-dark hover:underline"
          >
            Por {post.author.name}
          </a>
        )}

        <div className="mt-8 space-y-4 text-base leading-relaxed text-brand-text">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
