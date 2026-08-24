import { apiBase } from "@/services/baseApi";
import { TeamMember, TeamRole } from "@/interfaces/team-member";

export interface TeamMemberFilters {
  role?: TeamRole;
  active?: boolean;
}

export interface TeamMemberInput {
  slug: string;
  name: string;
  roleType: TeamRole;
  roleTitle?: string;
  bio: string;
  photoUrl?: string;
  email?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  active?: boolean;
  order?: number;
}

export const teamMembersService = {
  findAll: async (filters: TeamMemberFilters = {}): Promise<TeamMember[]> => {
    const { data } = await apiBase.get<TeamMember[]>("/team-members", {
      params: filters,
    });
    return data;
  },

  findBySlug: async (slug: string): Promise<TeamMember> => {
    const { data } = await apiBase.get<TeamMember>(`/team-members/${slug}`);
    return data;
  },

  create: async (input: TeamMemberInput): Promise<TeamMember> => {
    const { data } = await apiBase.post<TeamMember>(
      "/admin/team-members",
      input,
    );
    return data;
  },

  update: async (
    id: number,
    input: Partial<TeamMemberInput>,
  ): Promise<TeamMember> => {
    const { data } = await apiBase.put<TeamMember>(
      `/admin/team-members/${id}`,
      input,
    );
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await apiBase.delete(`/admin/team-members/${id}`);
  },
};
