import { TeamMember } from "@/interfaces/team-member";

export interface NewsPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImageUrl: string | null;
  published: boolean;
  publishedAt: string | null;
  authorId: number | null;
  createdAt: string;
  updatedAt: string;
  author?: TeamMember;
}
