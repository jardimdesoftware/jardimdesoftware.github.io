"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sprout } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/admin/Field";
import { API_ORIGIN } from "@/services/baseApi";
import { loginSchema, LoginFormData } from "@/schemas/auth";
import { useLogin } from "@/hooks/queries/useAuth";
import { isAuthenticated } from "@/utils/auth";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

function GoogleLoginError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (!error) return null;

  return (
    <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
      {error}
    </p>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/admin");
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const { mutate: login, isPending, error } = useLogin();

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-sm rounded-2xl border border-brand-border bg-white p-8 shadow-[0_10px_30px_rgba(30,136,229,0.08)]">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white">
            <Sprout className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-extrabold text-brand-text">
            Painel Administrativo
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            Jardim de Software — IFPE Campus Belo Jardim
          </p>
        </div>

        <Suspense fallback={null}>
          <GoogleLoginError />
        </Suspense>

        <a
          href={`${API_ORIGIN}/api/auth/google`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border-2 border-brand-border bg-white px-4 py-2.5 text-sm font-semibold text-brand-text transition-colors hover:bg-brand-bg"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            <path
              fill="#4285F4"
              d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.78-2.4 3.63v3.02h3.89c2.28-2.1 3.6-5.2 3.6-8.84z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.89-3.02c-1.08.72-2.45 1.15-4.04 1.15-3.11 0-5.74-2.1-6.68-4.92H1.3v3.09C3.26 21.3 7.3 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.32 14.31A7.2 7.2 0 0 1 4.93 12c0-.8.14-1.58.39-2.31V6.6H1.3A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.3 5.4l4.02-3.09z"
            />
            <path
              fill="#EA4335"
              d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.3 0 3.26 2.7 1.3 6.6l4.02 3.09C6.26 6.87 8.89 4.77 12 4.77z"
            />
          </svg>
          Entrar com Google
        </a>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-brand-border" />
          <span className="text-xs font-semibold uppercase text-brand-muted">
            ou
          </span>
          <div className="h-px flex-1 bg-brand-border" />
        </div>

        <form
          onSubmit={handleSubmit((values) => login(values))}
          className="space-y-4"
          noValidate
        >
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              disabled={isPending}
              {...register("email")}
            />
          </Field>

          <Field
            label="Senha"
            htmlFor="password"
            error={errors.password?.message}
          >
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              disabled={isPending}
              {...register("password")}
            />
          </Field>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {getFriendlyErrorMessage(error)}
            </p>
          )}

          <Button
            type="submit"
            variant="gradient"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
