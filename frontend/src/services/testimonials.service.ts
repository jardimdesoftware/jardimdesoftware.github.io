import { apiBase } from "@/services/baseApi";
import { Testimonial } from "@/interfaces/testimonial";

export interface TestimonialFilters {
  featured?: boolean;
}

export interface TestimonialInput {
  quote: string;
  authorName: string;
  authorRoleLabel?: string;
  authorPhotoUrl?: string;
  teamMemberId?: number;
  projectId?: number;
  featured?: boolean;
  order?: number;
}

export const testimonialsService = {
  findAll: async (
    filters: TestimonialFilters = {},
  ): Promise<Testimonial[]> => {
    const { data } = await apiBase.get<Testimonial[]>("/testimonials", {
      params: filters,
    });
    return data;
  },

  create: async (input: TestimonialInput): Promise<Testimonial> => {
    const { data } = await apiBase.post<Testimonial>(
      "/admin/testimonials",
      input,
    );
    return data;
  },

  update: async (
    id: number,
    input: Partial<TestimonialInput>,
  ): Promise<Testimonial> => {
    const { data } = await apiBase.put<Testimonial>(
      `/admin/testimonials/${id}`,
      input,
    );
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await apiBase.delete(`/admin/testimonials/${id}`);
  },
};
