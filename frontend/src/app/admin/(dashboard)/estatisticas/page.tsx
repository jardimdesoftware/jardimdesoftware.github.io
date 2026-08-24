"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Field } from "@/components/admin/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  siteStatsFormSchema,
  SiteStatsFormData,
  SiteStatsFormInput,
} from "@/schemas/site-stats";
import { useReplaceSiteStats, useSiteStats } from "@/hooks/queries/useSiteStats";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

export default function AdminSiteStatsPage() {
  const { data: stats, isLoading } = useSiteStats();
  const { mutate: replaceStats, isPending } = useReplaceSiteStats();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SiteStatsFormInput, unknown, SiteStatsFormData>({
    resolver: zodResolver(siteStatsFormSchema),
    defaultValues: { stats: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "stats" });

  // Popula o form assim que os dados chegam (so uma vez, para nao sobrescrever
  // edicoes em andamento do usuario a cada refetch em background).
  useEffect(() => {
    if (stats) {
      reset({
        stats: stats
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((s) => ({ id: s.id, label: s.label, value: s.value, order: s.order })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  const onSubmit = (values: SiteStatsFormData) => {
    replaceStats(values.stats, {
      onSuccess: () => toast.success("Estatísticas atualizadas com sucesso."),
      onError: (err) => toast.error(getFriendlyErrorMessage(err)),
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Estatísticas do Site"
        subtitle="Números exibidos na seção de destaque da landing page"
      />

      {isLoading && (
        <p className="py-10 text-center text-sm text-brand-muted">
          Carregando estatísticas...
        </p>
      )}

      {!isLoading && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-xl border border-brand-border bg-white p-6 shadow-sm"
          noValidate
        >
          {fields.length === 0 && (
            <p className="text-sm text-brand-muted">
              Nenhuma estatística cadastrada ainda. Adicione uma linha abaixo.
            </p>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 items-start gap-3 rounded-lg border border-brand-border p-3 sm:grid-cols-[1fr_1fr_100px_auto]"
              >
                <Field
                  label="Rótulo"
                  error={errors.stats?.[index]?.label?.message}
                >
                  <Input
                    placeholder="Ex.: PROJETOS"
                    disabled={isPending}
                    {...register(`stats.${index}.label` as const)}
                  />
                </Field>
                <Field
                  label="Valor"
                  error={errors.stats?.[index]?.value?.message}
                >
                  <Input
                    placeholder="Ex.: 12+"
                    disabled={isPending}
                    {...register(`stats.${index}.value` as const)}
                  />
                </Field>
                <Field
                  label="Ordem"
                  error={errors.stats?.[index]?.order?.message}
                >
                  <Input
                    type="number"
                    disabled={isPending}
                    {...register(`stats.${index}.order` as const)}
                  />
                </Field>
                <div className="flex items-end pb-1.5 sm:pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isPending}
                    onClick={() => remove(index)}
                    aria-label="Remover estatística"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => append({ label: "", value: "", order: fields.length })}
          >
            <Plus className="h-4 w-4" />
            Adicionar Linha
          </Button>

          <div className="flex items-center justify-end border-t border-brand-border pt-4">
            <Button type="submit" variant="gradient" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
