import { ProjectStatus } from "@/interfaces/project";

/**
 * Rotulos/variantes de badge para o status de projetos, compartilhados entre
 * a landing page (ProjectsPreviewSection) e as paginas /projetos e
 * /projetos/[slug].
 */
export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  EM_DESENVOLVIMENTO: "Em Desenvolvimento",
  CONCLUIDO: "Concluído",
};

export const PROJECT_STATUS_VARIANT: Record<
  ProjectStatus,
  "em-desenvolvimento" | "concluido"
> = {
  EM_DESENVOLVIMENTO: "em-desenvolvimento",
  CONCLUIDO: "concluido",
};
