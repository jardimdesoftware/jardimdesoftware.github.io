import { z } from "zod";
import { optionalIdRule, optionalUrlRule, slugRule } from "@/schemas/common";

export const newsPostSchema = z.object({
  slug: slugRule(160),
  title: z.string().min(1, "Título é obrigatório").max(200, "Título muito longo"),
  excerpt: z.string().min(1, "Resumo é obrigatório"),
  body: z.string().min(1, "Conteúdo é obrigatório"),
  coverImageUrl: optionalUrlRule,
  published: z.boolean().default(false),
  authorId: optionalIdRule,
});

export type NewsPostFormData = z.infer<typeof newsPostSchema>;
/** Tipo de "entrada" (pre-validacao) - ver comentario equivalente em team-members.ts. */
export type NewsPostFormInput = z.input<typeof newsPostSchema>;
