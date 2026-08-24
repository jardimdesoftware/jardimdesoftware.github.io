import { apiBase } from "@/services/baseApi";
import { Publication } from "@/interfaces/publication";

export interface PublicationAuthorInput {
  teamMemberId?: number;
  externalName?: string;
}

export interface PublicationInput {
  title: string;
  venue?: string;
  year: number;
  link?: string;
  order?: number;
  authors?: PublicationAuthorInput[];
}

export const publicationsService = {
  findAll: async (): Promise<Publication[]> => {
    const { data } = await apiBase.get<Publication[]>("/publications");
    return data;
  },

  create: async (input: PublicationInput): Promise<Publication> => {
    const { data } = await apiBase.post<Publication>(
      "/admin/publications",
      input,
    );
    return data;
  },

  update: async (
    id: number,
    input: Partial<PublicationInput>,
  ): Promise<Publication> => {
    const { data } = await apiBase.put<Publication>(
      `/admin/publications/${id}`,
      input,
    );
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await apiBase.delete(`/admin/publications/${id}`);
  },
};
