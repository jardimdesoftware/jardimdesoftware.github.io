export interface Testimonial {
  id: number;
  quote: string;
  authorName: string;
  authorRoleLabel: string | null;
  authorPhotoUrl: string | null;
  teamMemberId: number | null;
  projectId: number | null;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
