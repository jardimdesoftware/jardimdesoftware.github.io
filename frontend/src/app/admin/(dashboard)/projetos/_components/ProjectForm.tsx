"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/admin/Field";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { projectSchema, ProjectFormData, ProjectFormInput } from "@/schemas/projects";
import { useAdminTeamMembers } from "@/hooks/queries/useTeamMembers";

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormData>;
  onSubmit: (values: ProjectFormData) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export function ProjectForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: ProjectFormProps) {
  const router = useRouter();
  const { data: teamMembers = [] } = useAdminTeamMembers();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormInput, unknown, ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: "onBlur",
    defaultValues: {
      status: "EM_DESENVOLVIMENTO",
      featured: false,
      order: 0,
      members: [],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const featured = watch("featured") ?? false;
  const imageUrl = (watch("imageUrl") as string | undefined) ?? "";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-xl border border-brand-border bg-white p-6 shadow-sm"
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Título" htmlFor="title" error={errors.title?.message}>
          <Input id="title" disabled={isSubmitting} {...register("title")} />
        </Field>

        <Field
          label="Slug"
          htmlFor="slug"
          hint="Identificador único usado na URL"
          error={errors.slug?.message}
        >
          <Input id="slug" disabled={isSubmitting} {...register("slug")} />
        </Field>

        <Field label="Status" htmlFor="status" error={errors.status?.message}>
          <Select id="status" disabled={isSubmitting} {...register("status")}>
            <option value="EM_DESENVOLVIMENTO">Em Desenvolvimento</option>
            <option value="CONCLUIDO">Concluído</option>
          </Select>
        </Field>

        <Field
          label="Categoria"
          htmlFor="category"
          error={errors.category?.message}
        >
          <Input
            id="category"
            disabled={isSubmitting}
            {...register("category")}
          />
        </Field>
      </div>

      <Field label="Resumo" htmlFor="summary" error={errors.summary?.message}>
        <Textarea
          id="summary"
          rows={2}
          disabled={isSubmitting}
          {...register("summary")}
        />
      </Field>

      <Field
        label="Descrição completa"
        htmlFor="description"
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          rows={5}
          disabled={isSubmitting}
          {...register("description")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="URL do repositório" htmlFor="repoUrl" error={errors.repoUrl?.message}>
          <Input
            id="repoUrl"
            placeholder="https://..."
            disabled={isSubmitting}
            {...register("repoUrl")}
          />
        </Field>
        <Field label="URL da demo" htmlFor="demoUrl" error={errors.demoUrl?.message}>
          <Input
            id="demoUrl"
            placeholder="https://..."
            disabled={isSubmitting}
            {...register("demoUrl")}
          />
        </Field>
        <Field label="Imagem" htmlFor="imageUrl" error={errors.imageUrl?.message}>
          <ImageUploadField
            id="imageUrl"
            value={imageUrl}
            disabled={isSubmitting}
            onChange={(url) => setValue("imageUrl", url)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Ordem de exibição" htmlFor="order" error={errors.order?.message}>
          <Input
            id="order"
            type="number"
            disabled={isSubmitting}
            {...register("order")}
          />
        </Field>

        <div className="flex items-center gap-3 pt-6">
          <Switch
            id="featured"
            checked={featured}
            onCheckedChange={(value) => setValue("featured", value)}
            disabled={isSubmitting}
          />
          <label htmlFor="featured" className="text-sm font-semibold text-brand-text">
            Projeto em destaque
          </label>
        </div>
      </div>

      {/* Equipe do projeto */}
      <div className="border-t border-brand-border pt-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-brand-text">
            Equipe do Projeto
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => append({ teamMemberId: 0, roleLabel: "" })}
          >
            <Plus className="h-4 w-4" />
            Adicionar Integrante
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-brand-muted">
            Nenhum integrante vinculado a este projeto.
          </p>
        )}

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 items-start gap-3 rounded-lg border border-brand-border p-3 sm:grid-cols-[1fr_1fr_auto]"
            >
              <Field
                label="Integrante"
                error={errors.members?.[index]?.teamMemberId?.message}
              >
                <Select
                  disabled={isSubmitting}
                  {...register(`members.${index}.teamMemberId` as const)}
                >
                  <option value="">Selecione...</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                label="Papel no projeto"
                error={errors.members?.[index]?.roleLabel?.message}
              >
                <Input
                  placeholder="Ex.: Desenvolvedor Backend"
                  disabled={isSubmitting}
                  {...register(`members.${index}.roleLabel` as const)}
                />
              </Field>

              <div className="flex items-end pb-1.5 sm:pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={isSubmitting}
                  onClick={() => remove(index)}
                  aria-label="Remover integrante"
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
          onClick={() => router.push("/admin/projetos")}
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
