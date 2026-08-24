import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { LoginCredentials } from "@/interfaces/auth";
import { setAuthToken, isAuthenticated } from "@/utils/auth";

export const AUTH_KEYS = {
  me: ["auth", "me"] as const,
};

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      setAuthToken(data.accessToken);
      router.push("/admin");
    },
  });
}

/**
 * Dados do admin autenticado (GET /auth/me). So habilitada quando ha um
 * token salvo - evita disparar a chamada (e o interceptor de 401) em paginas
 * publicas ou antes do login.
 */
export function useCurrentAdmin() {
  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: () => authService.me(),
    enabled: isAuthenticated(),
    retry: false,
  });
}
