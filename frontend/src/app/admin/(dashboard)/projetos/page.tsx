"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { useAdminProjects, useDeleteProject } from "@/hooks/queries/useProjects";
import { Project } from "@/interfaces/project";
import { PROJECT_STATUS_LABEL, PROJECT_STATUS_VARIANT } from "@/lib/project-status";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

export default function AdminProjectsPage() {
  const { data: projects = [], isLoading, isError } = useAdminProjects();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();
  const [toDelete, setToDelete] = useState<Project | null>(null);

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    deleteProject(toDelete.id, {
      onSuccess: () => {
        toast.success(`"${toDelete.title}" excluído com sucesso.`);
        setToDelete(null);
      },
      onError: (err) => toast.error(getFriendlyErrorMessage(err)),
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Projetos"
        subtitle="Projetos exibidos na página /projetos"
        addHref="/admin/projetos/addProjeto"
        addLabel="Adicionar Projeto"
      />

      {isLoading && (
        <p className="py-10 text-center text-sm text-brand-muted">
          Carregando projetos...
        </p>
      )}
      {isError && (
        <p className="py-10 text-center text-sm text-red-600">
          Erro ao carregar projetos.
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
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Categoria</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Destaque</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Ordem</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-brand-bg/60">
                    <td className="px-4 py-3 font-semibold text-brand-text">
                      {project.title}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={PROJECT_STATUS_VARIANT[project.status]}>
                        {PROJECT_STATUS_LABEL[project.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {project.category || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {project.featured ? (
                        <Badge variant="active">Sim</Badge>
                      ) : (
                        <Badge variant="inactive">Não</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brand-muted">{project.order}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/projetos/editProjeto?id=${project.id}`}
                          className="text-xs font-semibold text-brand-blue hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => setToDelete(project)}
                          className="text-xs font-semibold text-red-600 hover:underline"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-brand-muted">
                      Nenhum projeto cadastrado.
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
        title="Excluir projeto"
        description={`Tem certeza que deseja excluir "${toDelete?.title}"? Essa ação não pode ser desfeita.`}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
