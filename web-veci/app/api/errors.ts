/**
 * Error tipado de la API: toda falla de red o del backend llega a la UI como `ApiError`.
 *
 * `api()` (`./client.ts`) convierte cada respuesta 4xx/5xx (`ApiErrorBody`) y cada falla de red en una
 * instancia de esta clase, así componentes y queries deciden por `error.code` sin importar si
 * respondió el mock de `server/` o FastAPI.
 */

import type { ApiErrorBody, ApiErrorCode } from './types'

export class ApiError extends Error {
  override readonly name = 'ApiError'

  constructor(
    /** Status HTTP; `0` cuando no hubo respuesta (sin red, CORS, timeout). */
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
    readonly details?: Record<string, unknown>
  ) {
    super(message)
  }

  /** Errores del cliente (4xx): reintentar no cambia la respuesta. */
  get isClientError() {
    return this.status >= 400 && this.status < 500
  }
}

/** Código por status, para respuestas que no traen `ApiErrorBody` (proxy, HTML de error…). */
function codeForStatus(status: number): ApiErrorCode {
  if (!status) return 'network_error'
  if (status === 400 || status === 422) return 'validation_error'
  if (status === 401) return 'unauthorized'
  if (status === 403) return 'forbidden'
  if (status === 404) return 'not_found'
  if (status === 409) return 'conflict'
  if (status === 429) return 'rate_limited'
  return 'internal_error'
}

function isErrorBody(data: unknown): data is ApiErrorBody {
  const error = (data as ApiErrorBody | undefined)?.error
  return typeof error?.code === 'string' && typeof error.message === 'string'
}

/** Normaliza cualquier falla de `$fetch` (`FetchError` de ofetch) en `ApiError`. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  const { status = 0, data } = (error ?? {}) as { status?: number, data?: unknown }
  if (isErrorBody(data)) return new ApiError(status, data.error.code, data.error.message, data.error.details)

  const message = error instanceof Error ? error.message : 'Error desconocido'
  return new ApiError(status, codeForStatus(status), message)
}

/** `true` si `error` es un `ApiError` (opcionalmente, con ese `code`). */
export function isApiError(error: unknown, code?: ApiErrorCode): error is ApiError {
  return error instanceof ApiError && (!code || error.code === code)
}

// TanStack Query tipa `error` como `ApiError` en todas las queries y mutaciones
declare module '@tanstack/vue-query' {
  interface Register {
    defaultError: ApiError
  }
}
