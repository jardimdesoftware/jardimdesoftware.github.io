"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/admin/Field";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  testimonialSchema,
  TestimonialFormData,
  TestimonialFormInput,
} from "@/schemas/testimonials";
import { useAdminTeamMembers } from "@/hooks/queries/useTeamMembers";
import { useAdminProjects } from "@/hooks/queries/useProjects";

interface TestimonialFormProps {
  defaultValues?: Partial<TestimonialFormData>;
  onSubmit: (values: TestimonialFormData) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export function TestimonialForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: TestimonialFormProps) {
  const router = useRouter();
  const { data: teamMembers = [] } = useAdminTeamMembers();
  const { data: projects = [] } = useAdminProjects();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TestimonialFormInput, unknown, TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    mode: "onBlur",
    defaultValues: {
      featured: true,
      order: 0,
      ...defaultValues,
    },
  });

  const featured = watch("featured") ?? true;
  const authorPhotoUrl = (watch("authorPhotoUrl") as string | undefined) ?? "";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-xl border border-brand-border bg-white p-6 shadow-sm"
      noValidate
    >
      <Field label="Depoimento" htmlFor="quote" error={errors.quote?.message}>
        <Textarea id="quote" rows={4} disabled={isSubmitting} {...register("quote")} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Nome do autor"
          htmlFor="authorName"
          error={errors.authorName?.message}
        >
          <Input
            id="authorName"
            disabled={isSubmitting}
            {...register("authorName")}
          />
        </Field>

        <Field
          label="Papel/cargo do autor"
          htmlFor="authorRoleLabel"
          error={errors.authorRoleLabel?.message}
        >
          <Input
            id="authorRoleLabel"
            disabled={isSubmitting}
            {...register("authorRoleLabel")}
          />
        </Field>
      </div>

      <Field
        label="Foto do autor"
        htmlFor="authorPhotoUrl"
        error={errors.authorPhotoUrl?.message}
      >
        <ImageUploadField
          id="authorPhotoUrl"
          value={authorPhotoUrl}
          disabled={isSubmitting}
          onChange={(url) => setValue("authorPhotoUrl", url)}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Integrante relacionado"
          htmlFor="teamMemberId"
          error={errors.teamMemberId?.message}
        >
          <Select id="teamMemberId" disabled={isSubmitting} {...register("teamMemberId")}>
            <option value="">Nenhum</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Projeto relacionado"
          htmlFor="projectId"
          error={errors.projectId?.message}
        >
          <Select id="projectId" disabled={isSubmitting} {...register("projectId")}>
            <option value="">Nenhum</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </Select>
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
            Depoimento em destaque
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-brand-border pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/depoimentos")}
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
