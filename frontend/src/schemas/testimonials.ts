import { z } from "zod";
import {
  optionalIdRule,
  optionalTrimmedString,
  optionalUrlRule,
  orderRule,
} from "@/schemas/common";

export const testimonialSchema = z.object({
  quote: z.string().min(1, "Depoimento é obrigatório"),
  authorName: z
    .string()
    .min(1, "Nome do autor é obrigatório")
    .max(200, "Nome muito longo"),
  authorRoleLabel: optionalTrimmedString(200, "Papel"),
  authorPhotoUrl: optionalUrlRule,
  teamMemberId: optionalIdRule,
  projectId: optionalIdRule,
  featured: z.boolean().default(true),
  order: orderRule,
});

export type TestimonialFormData = z.infer<typeof testimonialSchema>;
/** Tipo de "entrada" (pre-validacao) - ver comentario equivalente em team-members.ts. */
export type TestimonialFormInput = z.input<typeof testimonialSchema>;
