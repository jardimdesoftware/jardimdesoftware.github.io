"use client";

import { Fragment, useMemo } from "react";
import { ExternalLink } from "lucide-react";

import { usePublications } from "@/hooks/queries/usePublications";
import { Publication, PublicationAuthor } from "@/interfaces/publication";
import { Card, CardContent } from "@/components/ui/card";

function AuthorList({ authors }: { authors: PublicationAuthor[] }) {
  if (authors.length === 0) return null;

  return (
    <p className="mt-2 text-sm text-brand-muted">
      {authors.map((author, i) => (
        <Fragment key={author.id}>
          {i > 0 && ", "}
          {author.teamMember?.slug ? (
            // <a> normal (nao next/link): /equipe/:slug e resolvida no
            // cliente por StaticSlugRouter, nao existe como pagina
            // pre-gerada. Ver src/components/StaticSlugRouter.tsx.
            <a
              href={`/equipe/${author.teamMember.slug}/`}
              className="font-semibold text-brand-blue-dark hover:underline"
            >
              {author.teamMember.name}
            </a>
          ) : (
            <span>{author.externalName ?? author.teamMember?.name}</span>
          )}
        </Fragment>
      ))}
    </p>
  );
}

function groupByYear(publications: Publication[]) {
  const groups = new Map<number, Publication[]>();
  for (const publication of publications) {
    const list = groups.get(publication.year) ?? [];
    list.push(publication);
    groups.set(publication.year, list);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => b - a);
}

export function PublicationsList() {
  const { data: publications, isLoading } = usePublications();

  const grouped = useMemo(
    () => groupByYear(publications ?? []),
    [publications],
  );

  if (isLoading) {
    return (
      <div className="mt-12 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
    );
  }

  if (grouped.length === 0) {
    return (
      <p className="mt-12 text-center text-brand-muted">
        Em breve, novas publicações serão listadas aqui.
      </p>
    );
  }

  return (
    <div className="mx-auto mt-12 max-w-3xl space-y-12">
      {grouped.map(([year, items]) => (
        <div key={year}>
          <h2 className="text-xl font-extrabold text-brand-text">{year}</h2>
          <div className="mt-5 space-y-4">
            {items.map((publication) => (
              <Card key={publication.id}>
                <CardContent className="p-5">
                  <h3 className="font-bold text-brand-text">
                    {publication.title}
                  </h3>
                  {publication.venue && (
                    <p className="mt-1 text-sm italic text-brand-muted">
                      {publication.venue}
                    </p>
                  )}
                  {publication.authors && (
                    <AuthorList authors={publication.authors} />
                  )}
                  {publication.link && (
                    <a
                      href={publication.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
                    >
                      Acessar publicação
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
