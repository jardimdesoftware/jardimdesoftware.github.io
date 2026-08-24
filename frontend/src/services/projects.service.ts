import { apiBase } from "@/services/baseApi";
import { Project, ProjectStatus } from "@/interfaces/project";

export interface ProjectFilters {
  status?: ProjectStatus;
  featured?: boolean;
  category?: string;
}

export interface ProjectMemberInput {
  teamMemberId: number;
  roleLabel?: string;
}

export interface ProjectInput {
  slug: string;
  title: string;
  summary: string;
  description: string;
  status?: ProjectStatus;
  category?: string;
  repoUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  order?: number;
  members?: ProjectMemberInput[];
}

export const projectsService = {
  findAll: async (filters: ProjectFilters = {}): Promise<Project[]> => {
    const { data } = await apiBase.get<Project[]>("/projects", {
      params: filters,
    });
    return data;
  },

  findBySlug: async (slug: string): Promise<Project> => {
    const { data } = await apiBase.get<Project>(`/projects/${slug}`);
    return data;
  },

  create: async (input: ProjectInput): Promise<Project> => {
    const { data } = await apiBase.post<Project>("/admin/projects", input);
    return data;
  },

  update: async (
    id: number,
    input: Partial<ProjectInput>,
  ): Promise<Project> => {
    const { data } = await apiBase.put<Project>(
      `/admin/projects/${id}`,
      input,
    );
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await apiBase.delete(`/admin/projects/${id}`);
  },
};
