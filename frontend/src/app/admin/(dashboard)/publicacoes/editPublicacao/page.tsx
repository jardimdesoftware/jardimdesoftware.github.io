"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PublicationForm } from "@/app/admin/(dashboard)/publicacoes/_components/PublicationForm";
import { usePublications, useUpdatePublication } from "@/hooks/queries/usePublications";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

function EditPublicacaoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));

  const { data: publications = [], isLoading } = usePublications();
  const { mutate: updatePublication, isPending } = useUpdatePublication();

  const publication = publications.find((p) => p.id === id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Editar Publicação"
        subtitle={publication ? publication.title : undefined}
      />

      {isLoading && <p className="text-sm text-brand-muted">Carregando...</p>}

      {!isLoading && !publication && (
        <p className="text-sm text-red-600">
          Publicação não encontrada. Volte à listagem e tente novamente.
        </p>
      )}

      {publication && (
        <PublicationForm
          isSubmitting={isPending}
          submitLabel="Salvar Alterações"
          defaultValues={{
            title: publication.title,
            venue: publication.venue ?? undefined,
            year: publication.year,
            link: publication.link ?? undefined,
            order: publication.order,
            authors: (publication.authors ?? []).map((a) => ({
              teamMemberId: a.teamMemberId ?? undefined,
              externalName: a.externalName ?? undefined,
            })),
          }}
          onSubmit={(values) =>
            updatePublication(
              { id, input: values },
              {
                onSuccess: () => {
                  toast.success("Publicação atualizada com sucesso.");
                  router.push("/admin/publicacoes");
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

export default function EditPublicacaoPage() {
  return (
    <Suspense fallback={<p className="text-sm text-brand-muted">Carregando...</p>}>
      <EditPublicacaoContent />
    </Suspense>
  );
}
