import { AxiosError } from "axios";

/**
 * Traduz erros de chamadas a API (axios) em mensagens amigaveis para exibir
 * em toasts/formularios. Adaptado do helper equivalente do frontend do
 * qualeider (`frontend/src/utils/errorMessage.ts` la).
 */
export function getFriendlyErrorMessage(error: unknown): string {
  if (!error) return "Ocorreu um erro inesperado.";

  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string | string[] } | undefined;

    if (status && status >= 500) {
      return "Não foi possível processar sua solicitação agora. Tente novamente em alguns instantes.";
    }

    if (data?.message) {
      return Array.isArray(data.message) ? data.message[0] : data.message;
    }

    if (error.code === "ERR_NETWORK") {
      return "Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.";
    }

    switch (status) {
      case 400:
        return "Dados inválidos. Verifique as informações preenchidas.";
      case 401:
        return "Email ou senha incorretos. Tente novamente.";
      case 403:
        return "Você não tem permissão para realizar esta ação.";
      case 404:
        return "Recurso não encontrado.";
      default:
        return "Ocorreu um erro na comunicação com o servidor.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}

function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as { isAxiosError?: boolean }).isAxiosError === true
  );
}
