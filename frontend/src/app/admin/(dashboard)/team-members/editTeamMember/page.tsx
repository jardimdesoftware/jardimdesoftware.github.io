"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TeamMemberForm } from "@/app/admin/(dashboard)/team-members/_components/TeamMemberForm";
import {
  useAdminTeamMembers,
  useUpdateTeamMember,
} from "@/hooks/queries/useTeamMembers";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

function EditTeamMemberContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));

  const { data: members = [], isLoading } = useAdminTeamMembers();
  const { mutate: updateMember, isPending } = useUpdateTeamMember();

  const member = members.find((m) => m.id === id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Editar Integrante"
        subtitle={member ? member.name : undefined}
      />

      {isLoading && <p className="text-sm text-brand-muted">Carregando...</p>}

      {!isLoading && !member && (
        <p className="text-sm text-red-600">
          Integrante não encontrado. Volte à listagem e tente novamente.
        </p>
      )}

      {member && (
        <TeamMemberForm
          isSubmitting={isPending}
          submitLabel="Salvar Alterações"
          defaultValues={{
            slug: member.slug,
            name: member.name,
            roleType: member.roleType,
            roleTitle: member.roleTitle ?? undefined,
            bio: member.bio,
            photoUrl: member.photoUrl ?? undefined,
            email: member.email ?? undefined,
            linkedinUrl: member.linkedinUrl ?? undefined,
            githubUrl: member.githubUrl ?? undefined,
            active: member.active,
            order: member.order,
          }}
          onSubmit={(values) =>
            updateMember(
              { id, input: values },
              {
                onSuccess: () => {
                  toast.success("Integrante atualizado com sucesso.");
                  router.push("/admin/team-members");
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

export default function EditTeamMemberPage() {
  return (
    <Suspense fallback={<p className="text-sm text-brand-muted">Carregando...</p>}>
      <EditTeamMemberContent />
    </Suspense>
  );
}
