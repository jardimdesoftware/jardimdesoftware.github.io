import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  teamMembersService,
  TeamMemberFilters,
  TeamMemberInput,
} from "@/services/team-members.service";

export const TEAM_MEMBERS_KEYS = {
  all: ["team-members"] as const,
  list: (filters: TeamMemberFilters) =>
    ["team-members", "list", filters] as const,
  detail: (slug: string) => ["team-members", "detail", slug] as const,
};

export function useTeamMembers(filters: TeamMemberFilters = {}) {
  return useQuery({
    queryKey: TEAM_MEMBERS_KEYS.list(filters),
    queryFn: () => teamMembersService.findAll(filters),
  });
}

export function useTeamMember(slug: string) {
  return useQuery({
    queryKey: TEAM_MEMBERS_KEYS.detail(slug),
    queryFn: () => teamMembersService.findBySlug(slug),
  });
}

/**
 * Painel admin: lista completa (ativos + inativos) usada pela pagina de
 * listagem e pelas paginas de edicao (que recebem so `?id=` na URL e
 * precisam localizar o registro na lista para pre-preencher o formulario -
 * nao ha endpoint GET /admin/team-members/:id).
 */
export function useAdminTeamMembers() {
  return useTeamMembers({});
}

export function useCreateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TeamMemberInput) => teamMembersService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_MEMBERS_KEYS.all });
    },
  });
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: Partial<TeamMemberInput>;
    }) => teamMembersService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_MEMBERS_KEYS.all });
    },
  });
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => teamMembersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_MEMBERS_KEYS.all });
    },
  });
}
