"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TeamMemberForm } from "@/app/admin/(dashboard)/team-members/_components/TeamMemberForm";
import { useCreateTeamMember } from "@/hooks/queries/useTeamMembers";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

export default function AddTeamMemberPage() {
  const router = useRouter();
  const { mutate: createMember, isPending } = useCreateTeamMember();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Adicionar Integrante"
        subtitle="Cadastre um novo docente ou discente"
      />

      <TeamMemberForm
        isSubmitting={isPending}
        submitLabel="Cadastrar Integrante"
        onSubmit={(values) =>
          createMember(values, {
            onSuccess: () => {
              toast.success("Integrante cadastrado com sucesso.");
              router.push("/admin/team-members");
            },
            onError: (err) => toast.error(getFriendlyErrorMessage(err)),
          })
        }
      />
    </div>
  );
}
