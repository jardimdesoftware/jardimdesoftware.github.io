import { TeamMember } from "@/interfaces/team-member";

export interface PublicationAuthor {
  id: number;
  publicationId: number;
  teamMemberId: number | null;
  externalName: string | null;
  createdAt: string;
  /** Presente quando `teamMemberId` aponta para um integrante da equipe. */
  teamMember?: TeamMember;
}

export interface Publication {
  id: number;
  title: string;
  venue: string | null;
  year: number;
  link: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  authors?: PublicationAuthor[];
}
