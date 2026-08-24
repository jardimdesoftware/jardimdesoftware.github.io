"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/app/admin/(dashboard)/projetos/_components/ProjectForm";
import { useCreateProject } from "@/hooks/queries/useProjects";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

export default function AddProjetoPage() {
  const router = useRouter();
  const { mutate: createProject, isPending } = useCreateProject();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Adicionar Projeto"
        subtitle="Cadastre um novo projeto"
      />

      <ProjectForm
        isSubmitting={isPending}
        submitLabel="Cadastrar Projeto"
        onSubmit={(values) =>
          createProject(values, {
            onSuccess: () => {
              toast.success("Projeto cadastrado com sucesso.");
              router.push("/admin/projetos");
            },
            onError: (err) => toast.error(getFriendlyErrorMessage(err)),
          })
        }
      />
    </div>
  );
}
