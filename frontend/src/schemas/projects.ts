import { z } from "zod";
import {
  optionalTrimmedString,
  optionalUrlRule,
  orderRule,
  slugRule,
} from "@/schemas/common";

export const projectMemberRowSchema = z.object({
  teamMemberId: z.coerce
    .number({ message: "Selecione um integrante" })
    .int()
    .positive("Selecione um integrante"),
  roleLabel: optionalTrimmedString(200, "Papel"),
});

export const projectSchema = z.object({
  slug: slugRule(160),
  title: z.string().min(1, "Título é obrigatório").max(200, "Título muito longo"),
  summary: z.string().min(1, "Resumo é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  status: z.enum(["EM_DESENVOLVIMENTO", "CONCLUIDO"]).default(
    "EM_DESENVOLVIMENTO",
  ),
  category: optionalTrimmedString(120, "Categoria"),
  repoUrl: optionalUrlRule,
  demoUrl: optionalUrlRule,
  imageUrl: optionalUrlRule,
  featured: z.boolean().default(false),
  order: orderRule,
  members: z.array(projectMemberRowSchema).default([]),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
/** Tipo de "entrada" (pre-validacao) - ver comentario equivalente em team-members.ts. */
export type ProjectFormInput = z.input<typeof projectSchema>;
