/**
 * Utilitarios de autenticacao do painel administrativo.
 *
 * Adaptado do padrao usado no frontend do qualeider (ver
 * `frontend/src/utils/auth.ts` la), mas simplificado: o backend do Jardim de
 * Software tem um unico papel (admin autenticado via JWT), entao aqui so
 * importa "tem token" vs "nao tem token" - nao ha decodificacao de role.
 *
 * A chave de localStorage e distinta da usada pelo qualeider
 * ("authToken") para nao colidir caso alguem abra os dois projetos em
 * perfis de navegador relacionados.
 */
const TOKEN_KEY = "jardimAuthToken";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}
