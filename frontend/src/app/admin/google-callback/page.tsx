"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthToken } from "@/utils/auth";

/**
 * Destino do redirect feito por GET /api/auth/google/callback (backend) após
 * um login com Google bem-sucedido: recebe o JWT via query string, salva do
 * mesmo jeito que o login por senha e manda para o dashboard. Erros (email
 * sem acesso, etc.) o backend já redireciona direto para /admin/login?error=.
 */
function GoogleCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setAuthToken(token);
      router.replace("/admin");
    } else {
      router.replace("/admin/login");
    }
  }, [router, searchParams]);

  return null;
}

export default function GoogleCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg">
      <p className="text-sm font-medium text-brand-muted">Entrando...</p>
      <Suspense fallback={null}>
        <GoogleCallbackHandler />
      </Suspense>
    </div>
  );
}
