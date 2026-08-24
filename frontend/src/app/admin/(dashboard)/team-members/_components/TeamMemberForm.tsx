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
  teamMemberSchema,
  TeamMemberFormData,
  TeamMemberFormInput,
} from "@/schemas/team-members";

interface TeamMemberFormProps {
  defaultValues?: Partial<TeamMemberFormData>;
  onSubmit: (values: TeamMemberFormData) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export function TeamMemberForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: TeamMemberFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeamMemberFormInput, unknown, TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    mode: "onBlur",
    defaultValues: {
      active: true,
      order: 0,
      roleType: "DISCENTE",
      ...defaultValues,
    },
  });

  const active = watch("active") ?? true;
  const photoUrl = (watch("photoUrl") as string | undefined) ?? "";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 rounded-xl border border-brand-border bg-white p-6 shadow-sm"
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nome" htmlFor="name" error={errors.name?.message}>
          <Input id="name" disabled={isSubmitting} {...register("name")} />
        </Field>

        <Field
          label="Slug"
          htmlFor="slug"
          hint="Identificador único usado na URL (ex.: joao-silva)"
          error={errors.slug?.message}
        >
          <Input id="slug" disabled={isSubmitting} {...register("slug")} />
        </Field>

        <Field label="Tipo" htmlFor="roleType" error={errors.roleType?.message}>
          <Select id="roleType" disabled={isSubmitting} {...register("roleType")}>
            <option value="DOCENTE">Docente</option>
            <option value="DISCENTE">Discente</option>
          </Select>
        </Field>

        <Field
          label="Título/Cargo"
          htmlFor="roleTitle"
          error={errors.roleTitle?.message}
        >
          <Input
            id="roleTitle"
            disabled={isSubmitting}
            {...register("roleTitle")}
          />
        </Field>
      </div>

      <Field label="Biografia" htmlFor="bio" error={errors.bio?.message}>
        <Textarea id="bio" rows={4} disabled={isSubmitting} {...register("bio")} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Foto" htmlFor="photoUrl" error={errors.photoUrl?.message}>
          <ImageUploadField
            id="photoUrl"
            value={photoUrl}
            disabled={isSubmitting}
            onChange={(url) => setValue("photoUrl", url)}
          />
        </Field>

        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            disabled={isSubmitting}
            {...register("email")}
          />
        </Field>

        <Field
          label="LinkedIn"
          htmlFor="linkedinUrl"
          error={errors.linkedinUrl?.message}
        >
          <Input
            id="linkedinUrl"
            placeholder="https://..."
            disabled={isSubmitting}
            {...register("linkedinUrl")}
          />
        </Field>

        <Field label="GitHub" htmlFor="githubUrl" error={errors.githubUrl?.message}>
          <Input
            id="githubUrl"
            placeholder="https://..."
            disabled={isSubmitting}
            {...register("githubUrl")}
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
            id="active"
            checked={active}
            onCheckedChange={(value) => setValue("active", value)}
            disabled={isSubmitting}
          />
          <label htmlFor="active" className="text-sm font-semibold text-brand-text">
            Integrante ativo
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-brand-border pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/team-members")}
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
