"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { useAdminNews, useDeleteNewsPost } from "@/hooks/queries/useNews";
import { NewsPost } from "@/interfaces/news-post";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

export default function AdminNewsPage() {
  const { data: posts = [], isLoading, isError } = useAdminNews();
  const { mutate: deletePost, isPending: isDeleting } = useDeleteNewsPost();
  const [toDelete, setToDelete] = useState<NewsPost | null>(null);

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    deletePost(toDelete.id, {
      onSuccess: () => {
        toast.success(`"${toDelete.title}" excluída com sucesso.`);
        setToDelete(null);
      },
      onError: (err) => toast.error(getFriendlyErrorMessage(err)),
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Notícias"
        subtitle="Publicadas e rascunhos exibidos (quando publicados) em /noticias"
        addHref="/admin/noticias/addNoticia"
        addLabel="Adicionar Notícia"
      />

      {isLoading && (
        <p className="py-10 text-center text-sm text-brand-muted">
          Carregando notícias...
        </p>
      )}
      {isError && (
        <p className="py-10 text-center text-sm text-red-600">
          Erro ao carregar notícias.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-brand-bg">
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Título</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Autor</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-brand-bg/60">
                    <td className="px-4 py-3 font-semibold text-brand-text">
                      {post.title}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={post.published ? "active" : "inactive"}>
                        {post.published ? "Publicada" : "Rascunho"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {post.author?.name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/noticias/editNoticia?id=${post.id}`}
                          className="text-xs font-semibold text-brand-blue hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => setToDelete(post)}
                          className="text-xs font-semibold text-red-600 hover:underline"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-brand-muted">
                      Nenhuma notícia cadastrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Excluir notícia"
        description={`Tem certeza que deseja excluir "${toDelete?.title}"? Essa ação não pode ser desfeita.`}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
