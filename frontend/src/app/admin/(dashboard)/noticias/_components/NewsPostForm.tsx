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
import { newsPostSchema, NewsPostFormData, NewsPostFormInput } from "@/schemas/news";
import { useAdminTeamMembers } from "@/hooks/queries/useTeamMembers";

interface NewsPostFormProps {
  defaultValues?: Partial<NewsPostFormData>;
  onSubmit: (values: NewsPostFormData) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export function NewsPostForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
}: NewsPostFormProps) {
  const router = useRouter();
  const { data: teamMembers = [] } = useAdminTeamMembers();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewsPostFormInput, unknown, NewsPostFormData>({
    resolver: zodResolver(newsPostSchema),
    mode: "onBlur",
    defaultValues: {
      published: false,
      ...defaultValues,
    },
  });

  const published = watch("published") ?? false;
  const coverImageUrl = (watch("coverImageUrl") as string | undefined) ?? "";

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
      </div>

      <Field label="Resumo" htmlFor="excerpt" error={errors.excerpt?.message}>
        <Textarea
          id="excerpt"
          rows={2}
          disabled={isSubmitting}
          {...register("excerpt")}
        />
      </Field>

      <Field label="Conteúdo" htmlFor="body" error={errors.body?.message}>
        <Textarea id="body" rows={8} disabled={isSubmitting} {...register("body")} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Imagem de capa"
          htmlFor="coverImageUrl"
          error={errors.coverImageUrl?.message}
        >
          <ImageUploadField
            id="coverImageUrl"
            value={coverImageUrl}
            disabled={isSubmitting}
            onChange={(url) => setValue("coverImageUrl", url)}
          />
        </Field>

        <Field label="Autor" htmlFor="authorId" error={errors.authorId?.message}>
          <Select id="authorId" disabled={isSubmitting} {...register("authorId")}>
            <option value="">Sem autor</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="published"
          checked={published}
          onCheckedChange={(value) => setValue("published", value)}
          disabled={isSubmitting}
        />
        <label htmlFor="published" className="text-sm font-semibold text-brand-text">
          Publicada (visível em /noticias)
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-brand-border pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/noticias")}
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
