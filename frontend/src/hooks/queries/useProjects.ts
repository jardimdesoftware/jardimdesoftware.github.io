import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  projectsService,
  ProjectFilters,
  ProjectInput,
} from "@/services/projects.service";

export const PROJECTS_KEYS = {
  all: ["projects"] as const,
  list: (filters: ProjectFilters) => ["projects", "list", filters] as const,
  detail: (slug: string) => ["projects", "detail", slug] as const,
};

export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: PROJECTS_KEYS.list(filters),
    queryFn: () => projectsService.findAll(filters),
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: PROJECTS_KEYS.detail(slug),
    queryFn: () => projectsService.findBySlug(slug),
    enabled: slug.length > 0,
  });
}

/** Painel admin: lista completa de projetos (sem filtros). */
export function useAdminProjects() {
  return useProjects({});
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ProjectInput) => projectsService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEYS.all });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: Partial<ProjectInput>;
    }) => projectsService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEYS.all });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => projectsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_KEYS.all });
    },
  });
}
