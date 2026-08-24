import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { newsService, NewsFilters, NewsPostInput } from "@/services/news.service";

export const NEWS_KEYS = {
  all: ["news"] as const,
  list: (filters: NewsFilters) => ["news", "list", filters] as const,
  paginated: (filters: NewsFilters) =>
    ["news", "paginated", filters] as const,
  detail: (slug: string) => ["news", "detail", slug] as const,
  adminAll: ["news", "admin-all"] as const,
};

export function useNews(filters: NewsFilters = {}) {
  return useQuery({
    queryKey: NEWS_KEYS.list(filters),
    queryFn: () => newsService.findPublished(filters),
  });
}

export function useNewsPaginated(filters: NewsFilters = {}) {
  return useQuery({
    queryKey: NEWS_KEYS.paginated(filters),
    queryFn: () => newsService.findPublishedPaginated(filters),
  });
}

export function useNewsPost(slug: string) {
  return useQuery({
    queryKey: NEWS_KEYS.detail(slug),
    queryFn: () => newsService.findBySlug(slug),
  });
}

/** Painel admin: todas as noticias (publicadas + rascunhos). */
export function useAdminNews() {
  return useQuery({
    queryKey: NEWS_KEYS.adminAll,
    queryFn: () => newsService.findAllAdmin(),
  });
}

export function useCreateNewsPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewsPostInput) => newsService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.all });
    },
  });
}

export function useUpdateNewsPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: Partial<NewsPostInput>;
    }) => newsService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.all });
    },
  });
}

export function useDeleteNewsPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => newsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.all });
    },
  });
}
