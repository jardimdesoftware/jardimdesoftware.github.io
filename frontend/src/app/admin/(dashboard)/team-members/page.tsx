"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import {
  useAdminTeamMembers,
  useDeleteTeamMember,
} from "@/hooks/queries/useTeamMembers";
import { TeamMember } from "@/interfaces/team-member";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

const ROLE_LABEL: Record<TeamMember["roleType"], string> = {
  DOCENTE: "Docente",
  DISCENTE: "Discente",
};

export default function AdminTeamMembersPage() {
  const { data: members = [], isLoading, isError } = useAdminTeamMembers();
  const { mutate: deleteMember, isPending: isDeleting } =
    useDeleteTeamMember();
  const [toDelete, setToDelete] = useState<TeamMember | null>(null);

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    deleteMember(toDelete.id, {
      onSuccess: () => {
        toast.success(`"${toDelete.name}" excluído com sucesso.`);
        setToDelete(null);
      },
      onError: (err) => {
        toast.error(getFriendlyErrorMessage(err));
      },
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Integrantes"
        subtitle="Docentes e discentes exibidos na página /equipe"
        addHref="/admin/team-members/addTeamMember"
        addLabel="Adicionar Integrante"
      />

      {isLoading && (
        <p className="py-10 text-center text-sm text-brand-muted">
          Carregando integrantes...
        </p>
      )}
      {isError && (
        <p className="py-10 text-center text-sm text-red-600">
          Erro ao carregar integrantes.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-brand-bg">
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">
                    Título
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">
                    Ordem
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-brand-bg/60">
                    <td className="px-4 py-3 font-semibold text-brand-text">
                      {member.name}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          member.roleType === "DOCENTE" ? "docente" : "discente"
                        }
                      >
                        {ROLE_LABEL[member.roleType]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {member.roleTitle || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={member.active ? "active" : "inactive"}>
                        {member.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">{member.order}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/team-members/editTeamMember?id=${member.id}`}
                          className="text-xs font-semibold text-brand-blue hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => setToDelete(member)}
                          className="text-xs font-semibold text-red-600 hover:underline"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-10 text-center text-brand-muted"
                    >
                      Nenhum integrante cadastrado.
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
        title="Excluir integrante"
        description={`Tem certeza que deseja excluir "${toDelete?.name}"? Essa ação não pode ser desfeita.`}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
