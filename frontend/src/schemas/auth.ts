import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .max(254, "Email muito longo")
    .email("Formato de email inválido"),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .max(72, "Senha muito longa"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
