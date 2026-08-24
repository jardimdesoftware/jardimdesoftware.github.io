"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TestimonialForm } from "@/app/admin/(dashboard)/depoimentos/_components/TestimonialForm";
import {
  useAdminTestimonials,
  useUpdateTestimonial,
} from "@/hooks/queries/useTestimonials";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

function EditDepoimentoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));

  const { data: testimonials = [], isLoading } = useAdminTestimonials();
  const { mutate: updateTestimonial, isPending } = useUpdateTestimonial();

  const testimonial = testimonials.find((t) => t.id === id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Editar Depoimento"
        subtitle={testimonial ? testimonial.authorName : undefined}
      />

      {isLoading && <p className="text-sm text-brand-muted">Carregando...</p>}

      {!isLoading && !testimonial && (
        <p className="text-sm text-red-600">
          Depoimento não encontrado. Volte à listagem e tente novamente.
        </p>
      )}

      {testimonial && (
        <TestimonialForm
          isSubmitting={isPending}
          submitLabel="Salvar Alterações"
          defaultValues={{
            quote: testimonial.quote,
            authorName: testimonial.authorName,
            authorRoleLabel: testimonial.authorRoleLabel ?? undefined,
            authorPhotoUrl: testimonial.authorPhotoUrl ?? undefined,
            teamMemberId: testimonial.teamMemberId ?? undefined,
            projectId: testimonial.projectId ?? undefined,
            featured: testimonial.featured,
            order: testimonial.order,
          }}
          onSubmit={(values) =>
            updateTestimonial(
              { id, input: values },
              {
                onSuccess: () => {
                  toast.success("Depoimento atualizado com sucesso.");
                  router.push("/admin/depoimentos");
                },
                onError: (err) => toast.error(getFriendlyErrorMessage(err)),
              },
            )
          }
        />
      )}
    </div>
  );
}

export default function EditDepoimentoPage() {
  return (
    <Suspense fallback={<p className="text-sm text-brand-muted">Carregando...</p>}>
      <EditDepoimentoContent />
    </Suspense>
  );
}
