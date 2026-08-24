"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { useProjects } from "@/hooks/queries/useProjects";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/landing/Reveal";

const STATUS_LABEL: Record<string, string> = {
  EM_DESENVOLVIMENTO: "Em Desenvolvimento",
  CONCLUIDO: "Concluído",
};

const STATUS_VARIANT: Record<string, "em-desenvolvimento" | "concluido"> = {
  EM_DESENVOLVIMENTO: "em-desenvolvimento",
  CONCLUIDO: "concluido",
};

export function ProjectsPreviewSection() {
  const { data: projects, isLoading } = useProjects();
  const preview = projects?.slice(0, 6) ?? [];

  return (
    <section id="projetos" className="py-16 md:py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-brand-text">
            Projetos
          </h2>
          <p className="mt-2 text-brand-muted">
            Destaques de soluções desenvolvidas, projetos de extensão e
            inovação.
          </p>
        </Reveal>

        {isLoading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : preview.length === 0 ? (
          <p className="mt-12 text-center text-brand-muted">
            Em breve, novos projetos serão publicados aqui.
          </p>
        ) : (
          <Reveal className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {preview.map((project) => (
              <Card key={project.id} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <Badge variant={STATUS_VARIANT[project.status]}>
                      {STATUS_LABEL[project.status]}
                    </Badge>
                    {project.category && (
                      <span className="text-xs font-semibold text-brand-muted">
                        {project.category}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-brand-text">
                    {project.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
                    {project.summary}
                  </p>
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
                    >
                      Repositório
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </Reveal>
        )}

        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/projetos">
              Ver todos os projetos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
