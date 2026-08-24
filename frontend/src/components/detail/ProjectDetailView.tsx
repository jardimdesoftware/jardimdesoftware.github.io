"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";

import { useProject } from "@/hooks/queries/useProjects";
import {
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_VARIANT,
} from "@/lib/project-status";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ProjectDetailView({ slug }: { slug: string }) {
  // Export estatico: nao ha mais hidratacao vinda do servidor - o dado e
  // buscado aqui mesmo, no cliente, via useQuery (useProject).
  const { data: project, isLoading, isError } = useProject(slug);

  if (isLoading) {
    return (
      <section className="py-16 md:py-20">
        <div className="container max-w-4xl animate-pulse space-y-4">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="h-8 w-2/3 rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-64 w-full rounded-2xl bg-slate-200" />
        </div>
      </section>
    );
  }

  if (isError || !project) {
    return (
      <section className="py-16 md:py-20">
        <div className="container max-w-4xl text-center">
          <h1 className="text-2xl font-extrabold text-brand-text">
            Projeto não encontrado
          </h1>
          <p className="mt-2 text-brand-muted">
            O projeto que você está procurando não existe ou foi removido.
          </p>
          <Link
            href="/projetos"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Projetos
          </Link>
        </div>
      </section>
    );
  }

  const paragraphs = project.description
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="py-16 md:py-20">
      <div className="container max-w-4xl">
        <Link
          href="/projetos"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Projetos
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Badge variant={PROJECT_STATUS_VARIANT[project.status]}>
            {PROJECT_STATUS_LABEL[project.status]}
          </Badge>
          {project.category && (
            <span className="text-sm font-semibold text-brand-muted">
              {project.category}
            </span>
          )}
        </div>

        <h1 className="mt-3 text-3xl font-extrabold text-brand-text sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-3 text-lg text-brand-muted">{project.summary}</p>

        {(project.repoUrl || project.demoUrl) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brand-blue/30 px-5 py-2.5 text-sm font-bold text-brand-blue-dark transition-colors hover:bg-brand-blue/5"
              >
                <Github className="h-4 w-4" />
                Repositório
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-bold text-white shadow hover:opacity-90"
              >
                <ExternalLink className="h-4 w-4" />
                Ver demonstração
              </a>
            )}
          </div>
        )}

        <div className="mt-10 space-y-4 text-base leading-relaxed text-brand-text">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {project.members && project.members.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-extrabold text-brand-text">
              Equipe do Projeto
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.members.map((member) => {
                const teamMember = member.teamMember;
                const card = (
                  <Card className="h-full">
                    <CardContent className="flex items-center gap-3 p-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={teamMember?.photoUrl ?? undefined}
                          alt={teamMember?.name ?? ""}
                        />
                        <AvatarFallback>
                          {teamMember ? initials(teamMember.name) : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-brand-text">
                          {teamMember?.name ?? "Integrante"}
                        </p>
                        {member.roleLabel && (
                          <p className="text-sm text-brand-muted">
                            {member.roleLabel}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );

                // <a> normal (nao next/link): /equipe/:slug e resolvida
                // no cliente por StaticSlugRouter, nao existe como pagina
                // pre-gerada - precisa de uma navegacao completa para
                // passar pelo fallback do 404.html. Ver
                // src/components/StaticSlugRouter.tsx.
                return teamMember?.slug ? (
                  <a key={member.id} href={`/equipe/${teamMember.slug}/`}>
                    {card}
                  </a>
                ) : (
                  <div key={member.id}>{card}</div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
