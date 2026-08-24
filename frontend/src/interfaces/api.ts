/**
 * Envelope padrao das respostas do backend:
 * { statusCode, message, data }
 * (ver backend/src/common/interceptors/response-format.interceptor.ts)
 *
 * O axios interceptor em src/services/baseApi.tsx ja desembrulha isso -
 * services e hooks trabalham diretamente com o tipo de `data`.
 */
export interface ApiEnvelope<T> {
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Resposta paginada usada por /news: { data, total }.
 * O interceptor do axios tambem desembrulha o array `data` para
 * `response.data`, entao os services devolvem `T[]` diretamente; use este
 * tipo apenas ao lidar com a resposta "crua" (ex.: `_pagination`).
 */
export interface Paginated<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}
