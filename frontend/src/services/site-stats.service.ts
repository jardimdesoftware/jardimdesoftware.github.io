import { apiBase } from "@/services/baseApi";
import { SiteStat } from "@/interfaces/site-stat";

export interface SiteStatItemInput {
  id?: number;
  label: string;
  value: string;
  order?: number;
}

export const siteStatsService = {
  findAll: async (): Promise<SiteStat[]> => {
    const { data } = await apiBase.get<SiteStat[]>("/site-stats");
    return data;
  },

  /** PUT /admin/site-stats - substitui o conjunto inteiro (upsert em massa). */
  replaceAll: async (items: SiteStatItemInput[]): Promise<SiteStat[]> => {
    const { data } = await apiBase.put<SiteStat[]>(
      "/admin/site-stats",
      items,
    );
    return data;
  },
};
