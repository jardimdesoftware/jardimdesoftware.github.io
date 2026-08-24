"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminGuard } from "@/hooks/useAdminGuard";

/**
 * Layout do painel admin autenticado: sidebar fixa + area de conteudo.
 * Isolado em `(dashboard)` para que `/admin/login` (fora deste grupo, mas
 * ainda dentro de `/admin`) NAO passe pelo `useAdminGuard` nem mostre a
 * sidebar - e a propria pagina que concede o token.
 */
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isChecking } = useAdminGuard();

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-bg">
        <p className="text-sm text-brand-muted">Verificando sessão...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-6xl space-y-6 p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
