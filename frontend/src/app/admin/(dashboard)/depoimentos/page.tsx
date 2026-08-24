"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import {
  useAdminTestimonials,
  useDeleteTestimonial,
} from "@/hooks/queries/useTestimonials";
import { Testimonial } from "@/interfaces/testimonial";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

export default function AdminTestimonialsPage() {
  const { data: testimonials = [], isLoading, isError } = useAdminTestimonials();
  const { mutate: deleteTestimonial, isPending: isDeleting } = useDeleteTestimonial();
  const [toDelete, setToDelete] = useState<Testimonial | null>(null);

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    deleteTestimonial(toDelete.id, {
      onSuccess: () => {
        toast.success("Depoimento excluído com sucesso.");
        setToDelete(null);
      },
      onError: (err) => toast.error(getFriendlyErrorMessage(err)),
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Depoimentos"
        subtitle="Depoimentos exibidos na landing page"
        addHref="/admin/depoimentos/addDepoimento"
        addLabel="Adicionar Depoimento"
      />

      {isLoading && (
        <p className="py-10 text-center text-sm text-brand-muted">
          Carregando depoimentos...
        </p>
      )}
      {isError && (
        <p className="py-10 text-center text-sm text-red-600">
          Erro ao carregar depoimentos.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-brand-bg">
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Autor</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Depoimento</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Destaque</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-brand-bg/60">
                    <td className="px-4 py-3 font-semibold text-brand-text">
                      {testimonial.authorName}
                    </td>
                    <td className="max-w-md truncate px-4 py-3 text-brand-muted">
                      {testimonial.quote}
                    </td>
                    <td className="px-4 py-3">
                      {testimonial.featured ? (
                        <Badge variant="active">Sim</Badge>
                      ) : (
                        <Badge variant="inactive">Não</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/depoimentos/editDepoimento?id=${testimonial.id}`}
                          className="text-xs font-semibold text-brand-blue hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => setToDelete(testimonial)}
                          className="text-xs font-semibold text-red-600 hover:underline"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {testimonials.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-brand-muted">
                      Nenhum depoimento cadastrado.
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
        title="Excluir depoimento"
        description="Tem certeza que deseja excluir este depoimento? Essa ação não pode ser desfeita."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
