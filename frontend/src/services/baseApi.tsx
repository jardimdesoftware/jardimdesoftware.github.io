import axios from "axios";
import { clearAuthToken, getAuthToken } from "@/utils/auth";

/**
 * Base URL da API consumida pelo navegador.
 *
 * O frontend e um export estatico (GitHub Pages, sem runtime Node/SSR):
 * toda a busca de dados acontece no cliente, entao so existe UMA base URL,
 * definida em build time por NEXT_PUBLIC_API_URL (ver frontend/.env.example
 * e o workflow .github/workflows/deploy-pages.yml, que injeta essa variavel
 * a partir de uma Repository Variable do GitHub Actions). Sem valor
 * definido, cai em "/api" (util em dev local atras de um proxy).
 */
const CLIENT_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/** Origem (protocolo+host) da API, sem o sufixo "/api" - usada para links que
 * saem do axios (redirects OAuth, URLs de upload). */
export const API_ORIGIN = CLIENT_BASE_URL.replace(/\/api\/?$/, "");

export const apiBase = axios.create({
  baseURL: CLIENT_BASE_URL,
});

// Interceptor de requisicao: anexa `Authorization: Bearer <token>` quando
// houver um token salvo (login do admin). So roda no navegador - o SSR
// (Server Components / prefetch) nunca tem acesso ao localStorage e so
// consome os endpoints publicos mesmo, entao nao precisa de token.
apiBase.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor de resposta: em 401 (token ausente/invalido/expirado), limpa o
// token salvo e redireciona para o login do admin. So faz sentido no
// navegador - no SSR nao ha token nem `window` para redirecionar.
apiBase.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error?.response?.status === 401 &&
      window.location.pathname !== "/admin/login"
    ) {
      clearAuthToken();
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);

// Interceptor: desembrulha o envelope padrao do backend { statusCode, message, data }
// e a resposta paginada de /news { data, total }.
apiBase.interceptors.response.use(
  (response) => {
    // Caso 1: envelope padrao { statusCode, message, data }
    if (
      response.data &&
      typeof response.data === "object" &&
      "statusCode" in response.data &&
      "message" in response.data &&
      "data" in response.data
    ) {
      const envelope = {
        statusCode: response.data.statusCode,
        message: response.data.message,
      };
      return {
        ...response,
        data: response.data.data,
        _envelope: envelope,
      };
    }

    // Caso 2: resposta paginada { data: [], total: number, ... } (ex.: /news)
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data &&
      "total" in response.data &&
      Array.isArray(response.data.data)
    ) {
      const pagination = {
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
      };
      return {
        ...response,
        data: response.data.data,
        _pagination: pagination,
      };
    }

    // Caso 3: resposta simples - retorna como esta
    return response;
  },
  (error) => Promise.reject(error),
);
