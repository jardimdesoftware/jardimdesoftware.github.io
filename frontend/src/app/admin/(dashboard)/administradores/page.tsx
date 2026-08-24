"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/admin/Field";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  useAdminUsers,
  useCreateAdminUser,
  useDeleteAdminUser,
} from "@/hooks/queries/useAdminUsers";
import { useCurrentAdmin } from "@/hooks/queries/useAuth";
import { AdminUserListItem } from "@/services/admin-users.service";
import { adminUserSchema, AdminUserFormData, AdminUserFormInput } from "@/schemas/admin-users";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

function formatDate(value: string | null) {
  if (!value) return "Nunca";
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminUsersPage() {
  const { data: admins = [], isLoading, isError } = useAdminUsers();
  const { data: currentAdmin } = useCurrentAdmin();
  const { mutate: createAdminUser, isPending: isCreating } = useCreateAdminUser();
  const { mutate: deleteAdminUser, isPending: isDeleting } = useDeleteAdminUser();
  const [toDelete, setToDelete] = useState<AdminUserListItem | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminUserFormInput, unknown, AdminUserFormData>({
    resolver: zodResolver(adminUserSchema),
    mode: "onBlur",
  });

  const onSubmit = (values: AdminUserFormData) => {
    createAdminUser(values, {
      onSuccess: () => {
        toast.success("Acesso liberado com sucesso.");
        reset();
      },
      onError: (err) => toast.error(getFriendlyErrorMessage(err)),
    });
  };

  const handleConfirmDelete = () => {
    if (!toDelete) return;
    deleteAdminUser(toDelete.id, {
      onSuccess: () => {
        toast.success("Acesso removido com sucesso.");
        setToDelete(null);
      },
      onError: (err) => {
        toast.error(getFriendlyErrorMessage(err));
        setToDelete(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-text">
          Administradores
        </h1>
        <p className="mt-1 text-sm text-brand-muted">
          Quem pode entrar no painel. Libere um email aqui e a pessoa entra
          com "Entrar com Google" usando esse email — sem senha.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 rounded-xl border border-brand-border bg-white p-6 shadow-sm sm:flex-row sm:items-end"
        noValidate
      >
        <Field
          label="Email do Google"
          htmlFor="email"
          error={errors.email?.message}
          className="flex-1"
        >
          <Input
            id="email"
            type="email"
            placeholder="pessoa@gmail.com"
            disabled={isCreating}
            {...register("email")}
          />
        </Field>
        <Field
          label="Nome (opcional)"
          htmlFor="name"
          error={errors.name?.message}
          className="flex-1"
        >
          <Input id="name" disabled={isCreating} {...register("name")} />
        </Field>
        <Button type="submit" variant="gradient" disabled={isCreating}>
          {isCreating ? "Liberando..." : "Liberar acesso"}
        </Button>
      </form>

      {isLoading && (
        <p className="py-10 text-center text-sm text-brand-muted">
          Carregando administradores...
        </p>
      )}
      {isError && (
        <p className="py-10 text-center text-sm text-red-600">
          Erro ao carregar administradores.
        </p>
      )}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-xl border border-brand-border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-brand-bg">
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Nome</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Acesso</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-muted">Último login</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {admins.map((admin) => {
                  const isSelf = admin.id === currentAdmin?.id;
                  return (
                    <tr key={admin.id} className="hover:bg-brand-bg/60">
                      <td className="px-4 py-3 font-semibold text-brand-text">
                        {admin.email}
                        {isSelf && (
                          <span className="ml-2 text-xs font-normal text-brand-muted">
                            (você)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-brand-muted">
                        {admin.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          {admin.hasGoogle && <Badge variant="active">Google</Badge>}
                          {admin.hasPassword && <Badge variant="secondary">Senha</Badge>}
                          {!admin.hasGoogle && !admin.hasPassword && (
                            <Badge variant="inactive">Aguardando 1º login</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-brand-muted">
                        {formatDate(admin.lastLogin)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            disabled={isSelf}
                            onClick={() => setToDelete(admin)}
                            className="text-xs font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:text-brand-muted disabled:no-underline"
                          >
                            Remover acesso
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {admins.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-brand-muted">
                      Nenhum administrador cadastrado.
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
        title="Remover acesso"
        description={`Tem certeza que deseja remover o acesso de ${toDelete?.email}? A pessoa não conseguirá mais entrar no painel.`}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
