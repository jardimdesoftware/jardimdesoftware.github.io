import { z } from "zod";

export const siteStatRowSchema = z.object({
  id: z.number().int().optional(),
  label: z
    .string()
    .min(1, "Rótulo é obrigatório")
    .max(120, "Rótulo muito longo"),
  value: z
    .string()
    .min(1, "Valor é obrigatório")
    .max(60, "Valor muito longo"),
  order: z.coerce.number().int().default(0),
});

export const siteStatsFormSchema = z.object({
  stats: z.array(siteStatRowSchema),
});

export type SiteStatRowData = z.infer<typeof siteStatRowSchema>;
export type SiteStatsFormData = z.infer<typeof siteStatsFormSchema>;
/** Tipo de "entrada" (pre-validacao) - ver comentario equivalente em team-members.ts. */
export type SiteStatsFormInput = z.input<typeof siteStatsFormSchema>;
