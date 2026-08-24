import { TeamMember } from "@/interfaces/team-member";

export type ProjectStatus = "EM_DESENVOLVIMENTO" | "CONCLUIDO";

export interface ProjectMember {
  id: number;
  projectId: number;
  teamMemberId: number;
  roleLabel: string | null;
  createdAt: string;
  teamMember?: TeamMember;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: ProjectStatus;
  category: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  /** Presente apenas em GET /projects/:slug (findAll nao inclui members) */
  members?: ProjectMember[];
}
