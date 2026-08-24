"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { NewsPostForm } from "@/app/admin/(dashboard)/noticias/_components/NewsPostForm";
import { useAdminNews, useUpdateNewsPost } from "@/hooks/queries/useNews";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

function EditNoticiaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));

  const { data: posts = [], isLoading } = useAdminNews();
  const { mutate: updatePost, isPending } = useUpdateNewsPost();

  const post = posts.find((p) => p.id === id);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Editar Notícia" subtitle={post ? post.title : undefined} />

      {isLoading && <p className="text-sm text-brand-muted">Carregando...</p>}

      {!isLoading && !post && (
        <p className="text-sm text-red-600">
          Notícia não encontrada. Volte à listagem e tente novamente.
        </p>
      )}

      {post && (
        <NewsPostForm
          isSubmitting={isPending}
          submitLabel="Salvar Alterações"
          defaultValues={{
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            body: post.body,
            coverImageUrl: post.coverImageUrl ?? undefined,
            published: post.published,
            authorId: post.authorId ?? undefined,
          }}
          onSubmit={(values) =>
            updatePost(
              { id, input: values },
              {
                onSuccess: () => {
                  toast.success("Notícia atualizada com sucesso.");
                  router.push("/admin/noticias");
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

export default function EditNoticiaPage() {
  return (
    <Suspense fallback={<p className="text-sm text-brand-muted">Carregando...</p>}>
      <EditNoticiaContent />
    </Suspense>
  );
}
