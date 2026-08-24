export type TeamRole = "DOCENTE" | "DISCENTE";

export interface TeamMember {
  id: number;
  slug: string;
  name: string;
  roleType: TeamRole;
  roleTitle: string | null;
  bio: string;
  photoUrl: string | null;
  email: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
