"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PublicationForm } from "@/app/admin/(dashboard)/publicacoes/_components/PublicationForm";
import { useCreatePublication } from "@/hooks/queries/usePublications";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

export default function AddPublicacaoPage() {
  const router = useRouter();
  const { mutate: createPublication, isPending } = useCreatePublication();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Adicionar Publicação" subtitle="Cadastre uma nova publicação" />

      <PublicationForm
        isSubmitting={isPending}
        submitLabel="Cadastrar Publicação"
        onSubmit={(values) =>
          createPublication(values, {
            onSuccess: () => {
              toast.success("Publicação cadastrada com sucesso.");
              router.push("/admin/publicacoes");
            },
            onError: (err) => toast.error(getFriendlyErrorMessage(err)),
          })
        }
      />
    </div>
  );
}
