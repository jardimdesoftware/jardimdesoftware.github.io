"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Field } from "@/components/admin/Field";
import {
  publicationSchema,
  PublicationFormData,
  PublicationFormInput,
} from "@/schemas/publications";
import { useAdminTeamMembers } from "@/hooks/queries/useTeamMembers";

interface PublicationFormProps {
  defaultValues?: Partial<PublicationFormData>;
  onSubmit: (values: PublicationFormData) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export function PublicationForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: PublicationFormProps) {
  const router = useRouter();
  const { data: teamMembers = [] } = useAdminTeamMembers();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PublicationFormInput, unknown, PublicationFormData>({
    resolver: zodResolver(publicationSchema),
    mode: "onBlur",
    defaultValues: {
      order: 0,
      authors: [],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "authors" });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-xl border border-brand-border bg-white p-6 shadow-sm"
      noValidate
    >
      <Field label="Título" htmlFor="title" error={errors.title?.message}>
        <Input id="title" disabled={isSubmitting} {...register("title")} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Veículo" htmlFor="venue" error={errors.venue?.message}>
          <Input id="venue" disabled={isSubmitting} {...register("venue")} />
        </Field>

        <Field label="Ano" htmlFor="year" error={errors.year?.message}>
          <Input
            id="year"
            type="number"
            disabled={isSubmitting}
            {...register("year")}
          />
        </Field>

        <Field label="Ordem de exibição" htmlFor="order" error={errors.order?.message}>
          <Input
            id="order"
            type="number"
            disabled={isSubmitting}
            {...register("order")}
          />
        </Field>
      </div>

      <Field label="Link" htmlFor="link" error={errors.link?.message}>
        <Input
          id="link"
          placeholder="https://..."
          disabled={isSubmitting}
          {...register("link")}
        />
      </Field>

      {/* Autores */}
      <div className="border-t border-brand-border pt-5">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-bold text-brand-text">Autores</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => append({ teamMemberId: undefined, externalName: "" })}
          >
            <Plus className="h-4 w-4" />
            Adicionar Autor
          </Button>
        </div>
        <p className="mb-3 text-xs text-brand-muted">
          Em cada linha, selecione um integrante da equipe OU informe um nome
          externo — não os dois.
        </p>

        {fields.length === 0 && (
          <p className="text-sm text-brand-muted">Nenhum autor vinculado.</p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 items-start gap-3 rounded-lg border border-brand-border p-3 sm:grid-cols-[1fr_1fr_auto]"
            >
              <Field label="Integrante (interno)">
                <Select
                  disabled={isSubmitting}
                  {...register(`authors.${index}.teamMemberId` as const)}
                >
                  <option value="">Nenhum</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                label="Nome externo"
                error={errors.authors?.[index]?.externalName?.message}
              >
                <Input
                  placeholder="Ex.: Fulano de Tal (outra instituição)"
                  disabled={isSubmitting}
                  {...register(`authors.${index}.externalName` as const)}
                />
              </Field>

              <div className="flex items-end pb-1.5 sm:pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={isSubmitting}
                  onClick={() => remove(index)}
                  aria-label="Remover autor"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-brand-border pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/publicacoes")}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="gradient" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
