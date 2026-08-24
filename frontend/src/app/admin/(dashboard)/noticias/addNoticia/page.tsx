"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { NewsPostForm } from "@/app/admin/(dashboard)/noticias/_components/NewsPostForm";
import { useCreateNewsPost } from "@/hooks/queries/useNews";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

export default function AddNoticiaPage() {
  const router = useRouter();
  const { mutate: createPost, isPending } = useCreateNewsPost();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Adicionar Notícia" subtitle="Cadastre uma nova notícia" />

      <NewsPostForm
        isSubmitting={isPending}
        submitLabel="Cadastrar Notícia"
        onSubmit={(values) =>
          createPost(values, {
            onSuccess: () => {
              toast.success("Notícia cadastrada com sucesso.");
              router.push("/admin/noticias");
            },
            onError: (err) => toast.error(getFriendlyErrorMessage(err)),
          })
        }
      />
    </div>
  );
}
