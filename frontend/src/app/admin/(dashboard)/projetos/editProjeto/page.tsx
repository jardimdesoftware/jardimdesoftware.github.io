"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/app/admin/(dashboard)/projetos/_components/ProjectForm";
import {
  useAdminProjects,
  useProject,
  useUpdateProject,
} from "@/hooks/queries/useProjects";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

function EditProjetoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));

  // GET /projects (lista, sem `members`) so serve para localizar o slug do
  // projeto a partir do `?id=` da URL. Os dados completos (incluindo
  // `members`) so vem de GET /projects/:slug - por isso o segundo passo
  // abaixo com `useProject`.
  const { data: projects = [], isLoading: isLoadingList } = useAdminProjects();
  const projectSummary = projects.find((p) => p.id === id);

  const { data: project, isLoading: isLoadingDetail } = useProject(
    projectSummary?.slug ?? "",
  );

  const { mutate: updateProject, isPending } = useUpdateProject();

  const isLoading = isLoadingList || (Boolean(projectSummary) && isLoadingDetail);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Editar Projeto"
        subtitle={project ? project.title : undefined}
      />

      {isLoading && <p className="text-sm text-brand-muted">Carregando...</p>}

      {!isLoading && !project && (
        <p className="text-sm text-red-600">
          Projeto não encontrado. Volte à listagem e tente novamente.
        </p>
      )}

      {project && (
        <ProjectForm
          isSubmitting={isPending}
          submitLabel="Salvar Alterações"
          defaultValues={{
            slug: project.slug,
            title: project.title,
            summary: project.summary,
            description: project.description,
            status: project.status,
            category: project.category ?? undefined,
            repoUrl: project.repoUrl ?? undefined,
            demoUrl: project.demoUrl ?? undefined,
            imageUrl: project.imageUrl ?? undefined,
            featured: project.featured,
            order: project.order,
            members: (project.members ?? []).map((m) => ({
              teamMemberId: m.teamMemberId,
              roleLabel: m.roleLabel ?? undefined,
            })),
          }}
          onSubmit={(values) =>
            updateProject(
              { id, input: values },
              {
                onSuccess: () => {
                  toast.success("Projeto atualizado com sucesso.");
                  router.push("/admin/projetos");
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

export default function EditProjetoPage() {
  return (
    <Suspense fallback={<p className="text-sm text-brand-muted">Carregando...</p>}>
      <EditProjetoContent />
    </Suspense>
  );
}
