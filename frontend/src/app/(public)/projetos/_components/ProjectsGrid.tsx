"use client";

import { useMemo, useState } from "react";

import { useProjects } from "@/hooks/queries/useProjects";
import { ProjectStatus } from "@/interfaces/project";
import {
  PROJECT_STATUS_LABEL,
  PROJECT_STATUS_VARIANT,
} from "@/lib/project-status";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { value: ProjectStatus | "TODOS"; label: string }[] = [
  { value: "TODOS", label: "Todos" },
  { value: "EM_DESENVOLVIMENTO", label: "Em Desenvolvimento" },
  { value: "CONCLUIDO", label: "Concluído" },
];

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
        active
          ? "border-transparent bg-brand-gradient text-white shadow"
          : "border-brand-border bg-white text-brand-muted hover:border-brand-blue/40 hover:text-brand-blue-dark",
      )}
    >
      {children}
    </button>
  );
}

export function ProjectsGrid() {
  const { data: projects, isLoading } = useProjects();
  const [status, setStatus] = useState<ProjectStatus | "TODOS">("TODOS");
  const [category, setCategory] = useState<string | "TODAS">("TODAS");

  const categories = useMemo(() => {
    const unique = new Set(
      (projects ?? [])
        .map((project) => project.category)
        .filter((value): value is string => Boolean(value)),
    );
    return Array.from(unique).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [projects]);

  const filtered = useMemo(() => {
    return (projects ?? []).filter((project) => {
      if (status !== "TODOS" && project.status !== status) return false;
      if (category !== "TODAS" && project.category !== category) return false;
      return true;
    });
  }, [projects, status, category]);

  if (isLoading) {
    return (
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {STATUS_FILTERS.map((filter) => (
            <FilterPill
              key={filter.value}
              active={status === filter.value}
              onClick={() => setStatus(filter.value)}
            >
              {filter.label}
            </FilterPill>
          ))}
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <FilterPill
              active={category === "TODAS"}
              onClick={() => setCategory("TODAS")}
            >
              Todas as categorias
            </FilterPill>
            {categories.map((cat) => (
              <FilterPill
                key={cat}
                active={category === cat}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </FilterPill>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-brand-muted">
          Nenhum projeto encontrado para os filtros selecionados.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <Badge variant={PROJECT_STATUS_VARIANT[project.status]}>
                    {PROJECT_STATUS_LABEL[project.status]}
                  </Badge>
                  {project.category && (
                    <span className="text-xs font-semibold text-brand-muted">
                      {project.category}
                    </span>
                  )}
                </div>
                <h2 className="mt-4 text-lg font-bold text-brand-text">
                  {project.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
                  {project.summary}
                </p>
                {/* <a> normal (nao next/link): /projetos/:slug e resolvida
                    no cliente por StaticSlugRouter, nao existe como pagina
                    pre-gerada - precisa de navegacao completa para passar
                    pelo fallback do 404.html. Ver
                    src/components/StaticSlugRouter.tsx. */}
                <a
                  href={`/projetos/${project.slug}/`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
                >
                  Ver detalhes
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
