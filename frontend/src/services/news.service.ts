import { AxiosResponse } from "axios";
import { apiBase } from "@/services/baseApi";
import { NewsPost } from "@/interfaces/news-post";

export interface NewsFilters {
  page?: number;
  limit?: number;
}

export interface PaginatedNews {
  items: NewsPost[];
  total: number;
  page: number;
  limit: number;
}

export interface NewsPostInput {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImageUrl?: string;
  published?: boolean;
  authorId?: number;
}

/**
 * O interceptor de axios em baseApi.tsx anexa `_pagination` (ver "Caso 2") a resposta
 * do axios quando o backend devolve o formato paginado { data, total, page,
 * limit }, mas isso nao faz parte do tipo `AxiosResponse` - so o tipamos aqui
 * para o unico consumidor que precisa do total (findPublishedPaginated).
 */
interface ResponseWithPagination<T> extends AxiosResponse<T> {
  _pagination?: { total: number; page?: number; limit?: number };
}

export const newsService = {
  /**
   * GET /news e paginado ({ data, total }), mas o interceptor do axios em
   * baseApi.tsx ja desembrulha isso para `response.data = data` (o array).
   * O total fica disponivel em `response._pagination` caso seja necessario
   * no futuro (ex.: paginacao na pagina /noticias completa).
   */
  findPublished: async (filters: NewsFilters = {}): Promise<NewsPost[]> => {
    const { data } = await apiBase.get<NewsPost[]>("/news", {
      params: filters,
    });
    return data;
  },

  /**
   * Mesma chamada de `findPublished`, mas preservando o total de itens (via
   * `_pagination`) para alimentar os controles de paginacao de /noticias.
   */
  findPublishedPaginated: async (
    filters: NewsFilters = {},
  ): Promise<PaginatedNews> => {
    const response = (await apiBase.get<NewsPost[]>("/news", {
      params: filters,
    })) as ResponseWithPagination<NewsPost[]>;
    const pagination = response._pagination;
    const page = pagination?.page ?? filters.page ?? 1;
    const limit = pagination?.limit ?? filters.limit ?? response.data.length;
    return {
      items: response.data,
      total: pagination?.total ?? response.data.length,
      page,
      limit,
    };
  },

  findBySlug: async (slug: string): Promise<NewsPost> => {
    const { data } = await apiBase.get<NewsPost>(`/news/${slug}`);
    return data;
  },

  /** GET /admin/news - todas as noticias, incluindo rascunhos (published=false). */
  findAllAdmin: async (): Promise<NewsPost[]> => {
    const { data } = await apiBase.get<NewsPost[]>("/admin/news");
    return data;
  },

  create: async (input: NewsPostInput): Promise<NewsPost> => {
    const { data } = await apiBase.post<NewsPost>("/admin/news", input);
    return data;
  },

  update: async (
    id: number,
    input: Partial<NewsPostInput>,
  ): Promise<NewsPost> => {
    const { data } = await apiBase.put<NewsPost>(`/admin/news/${id}`, input);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await apiBase.delete(`/admin/news/${id}`);
  },
};
