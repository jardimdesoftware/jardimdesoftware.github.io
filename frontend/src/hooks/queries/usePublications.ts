import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  publicationsService,
  PublicationInput,
} from "@/services/publications.service";

export const PUBLICATIONS_KEYS = {
  all: ["publications"] as const,
  list: () => ["publications", "list"] as const,
};

export function usePublications() {
  return useQuery({
    queryKey: PUBLICATIONS_KEYS.list(),
    queryFn: () => publicationsService.findAll(),
  });
}

export function useCreatePublication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PublicationInput) =>
      publicationsService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLICATIONS_KEYS.all });
    },
  });
}

export function useUpdatePublication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: Partial<PublicationInput>;
    }) => publicationsService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLICATIONS_KEYS.all });
    },
  });
}

export function useDeletePublication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => publicationsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLICATIONS_KEYS.all });
    },
  });
}
