import { z } from "zod";
import {
  optionalEmailRule,
  optionalTrimmedString,
  optionalUrlRule,
  orderRule,
  slugRule,
} from "@/schemas/common";

export const teamMemberSchema = z.object({
  slug: slugRule(120),
  name: z.string().min(1, "Nome é obrigatório").max(200, "Nome muito longo"),
  roleType: z.enum(["DOCENTE", "DISCENTE"], {
    message: "Selecione o tipo",
  }),
  roleTitle: optionalTrimmedString(200, "Título"),
  bio: z.string().min(1, "Biografia é obrigatória"),
  photoUrl: optionalUrlRule,
  email: optionalEmailRule,
  linkedinUrl: optionalUrlRule,
  githubUrl: optionalUrlRule,
  active: z.boolean().default(true),
  order: orderRule,
});

export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
/**
 * Tipo de "entrada" do schema (antes da validacao/coercao) - usado como
 * generico de `useForm` para os `defaultValues`/`register`, ja que alguns
 * campos (com `.default()`/preprocess) tem um shape mais permissivo antes de
 * validados do que o shape final (`TeamMemberFormData`) recebido no
 * `onSubmit`. Ver `useForm<Input, Context, Output>` nos forms admin.
 */
export type TeamMemberFormInput = z.input<typeof teamMemberSchema>;
