import { z } from "zod";
import { optionalTrimmedString } from "@/schemas/common";

export const adminUserSchema = z.object({
  email: z.string().email("Email inválido"),
  name: optionalTrimmedString(200, "Nome"),
});

export type AdminUserFormData = z.infer<typeof adminUserSchema>;
export type AdminUserFormInput = z.input<typeof adminUserSchema>;
