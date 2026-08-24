import { z } from "zod";

/**
 * Atomos reutilizaveis entre os schemas de formulario do painel admin.
 * Campos opcionais tipo URL/email/texto sao tratados como "" no formulario
 * (inputs HTML nao tem estado `undefined`), entao normalizamos "" -> undefined
 * antes de validar - assim um campo deixado em branco nao dispara
 * `@IsUrl()`/`@IsEmail()` do backend (que so validam quando o valor esta
 * presente, ja que sao `@IsOptional()`).
 */
export function optionalTrimmedString(max: number, label = "Campo") {
  return z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z
      .string()
      .max(max, `${label} deve ter no máximo ${max} caracteres`)
      .optional(),
  );
}

export const optionalUrlRule = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().url("URL inválida").optional(),
);

export const optionalEmailRule = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().email("Email inválido").optional(),
);

/** Select opcional cujo `<option value="">` representa "nenhum". */
export const optionalIdRule = z.preprocess((v) => {
  if (v === "" || v === undefined || v === null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : v;
}, z.number().int().positive().optional());

export const orderRule = z.coerce
  .number({ message: "Ordem deve ser um número" })
  .int("Ordem deve ser um número inteiro")
  .default(0);

export const slugRule = (max: number) =>
  z
    .string()
    .min(1, "Slug é obrigatório")
    .max(max, `Slug deve ter no máximo ${max} caracteres`)
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Slug deve conter apenas letras minúsculas, números e hífens",
    );
