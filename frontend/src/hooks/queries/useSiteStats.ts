import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  siteStatsService,
  SiteStatItemInput,
} from "@/services/site-stats.service";

export const SITE_STATS_KEYS = {
  all: ["site-stats"] as const,
};

export function useSiteStats() {
  return useQuery({
    queryKey: SITE_STATS_KEYS.all,
    queryFn: () => siteStatsService.findAll(),
  });
}

export function useReplaceSiteStats() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: SiteStatItemInput[]) =>
      siteStatsService.replaceAll(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SITE_STATS_KEYS.all });
    },
  });
}
