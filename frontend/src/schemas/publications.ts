import { z } from "zod";
import { optionalIdRule, optionalTrimmedString, optionalUrlRule, orderRule } from "@/schemas/common";

/**
 * Linha de autor: mutuamente exclusiva entre `teamMemberId` (integrante
 * interno) e `externalName` (autor externo), mas o backend nao obriga - a
 * validacao de "escolha um ou outro" e so uma orientacao de UX aqui (ver
 * `refine` abaixo).
 */
export const publicationAuthorRowSchema = z
  .object({
    teamMemberId: optionalIdRule,
    externalName: optionalTrimmedString(200, "Nome"),
  })
  .refine((row) => row.teamMemberId !== undefined || !!row.externalName, {
    message: "Selecione um integrante ou informe um nome externo",
    path: ["externalName"],
  });

export const publicationSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(300, "Título muito longo"),
  venue: optionalTrimmedString(200, "Veículo"),
  year: z.coerce
    .number({ message: "Ano é obrigatório" })
    .int("Ano deve ser um número inteiro"),
  link: optionalUrlRule,
  order: orderRule,
  authors: z.array(publicationAuthorRowSchema).default([]),
});

export type PublicationFormData = z.infer<typeof publicationSchema>;
/** Tipo de "entrada" (pre-validacao) - ver comentario equivalente em team-members.ts. */
export type PublicationFormInput = z.input<typeof publicationSchema>;
