import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  testimonialsService,
  TestimonialFilters,
  TestimonialInput,
} from "@/services/testimonials.service";

export const TESTIMONIALS_KEYS = {
  all: ["testimonials"] as const,
  list: (filters: TestimonialFilters) =>
    ["testimonials", "list", filters] as const,
};

export function useTestimonials(filters: TestimonialFilters = {}) {
  return useQuery({
    queryKey: TESTIMONIALS_KEYS.list(filters),
    queryFn: () => testimonialsService.findAll(filters),
  });
}

/** Painel admin: lista completa de depoimentos (sem filtro de destaque). */
export function useAdminTestimonials() {
  return useTestimonials({});
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TestimonialInput) => testimonialsService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TESTIMONIALS_KEYS.all });
    },
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: Partial<TestimonialInput>;
    }) => testimonialsService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TESTIMONIALS_KEYS.all });
    },
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => testimonialsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TESTIMONIALS_KEYS.all });
    },
  });
}
