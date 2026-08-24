"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { usePublications, useDeletePublication } from "@/hooks/queries/usePublications";
import { Publication } from "@/interfaces/publication";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

export default function AdminPublicationsPage() {
  const { data: publications = [], isLoading, isError } = usePublications();
  const { mutate: deletePublication, isPending: isDeleting } = useDeletePublication();
  const [toDelete, setToDelete] = useState<Publication | null>(null);

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    deletePublication(toDelete.id, {
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
        title="Publicações"
        subtitle="Publicações exibidas na página /publicacoes"
        addHref="/admin/publicacoes/addPublicacao"
        addLabel="Adicionar Publicação"
      />

      {isLoading && (
        <p className="py-10 text-center text-sm text-brand-muted">
          Carregando publicações...
        </p>
      )}
      {isError && (
        <p className="py-10 text-center text-sm text-red-600">
          Erro ao carregar publicações.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-brand-bg">
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Título</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Veículo</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Ano</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Autores</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {publications.map((pub) => (
                  <tr key={pub.id} className="hover:bg-brand-bg/60">
                    <td className="px-4 py-3 font-semibold text-brand-text">{pub.title}</td>
                    <td className="px-4 py-3 text-brand-muted">{pub.venue || "—"}</td>
                    <td className="px-4 py-3 text-brand-muted">{pub.year}</td>
                    <td className="px-4 py-3 text-brand-muted">
                      {(pub.authors ?? [])
                        .map((a) => a.teamMember?.name || a.externalName)
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/publicacoes/editPublicacao?id=${pub.id}`}
                          className="text-xs font-semibold text-brand-blue hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => setToDelete(pub)}
                          className="text-xs font-semibold text-red-600 hover:underline"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {publications.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-brand-muted">
                      Nenhuma publicação cadastrada.
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
        title="Excluir publicação"
        description={`Tem certeza que deseja excluir "${toDelete?.title}"? Essa ação não pode ser desfeita.`}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
