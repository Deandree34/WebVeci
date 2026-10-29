/**
 * Utilidades del mock de la API (`server/api/v1/`). Nitro las auto-importa en los handlers.
 *
 * ⚠️ TEMPORAL — se borran junto con `server/api/v1/` y `server/mock/` cuando exista el backend.
 *
 * Imitan el contrato del backend FastAPI (`app/api/types.ts`):
 *  - éxito → el recurso tal cual, con status 2xx;
 *  - error → `ApiErrorBody` (`{ error: { code, message, details? } }`) con el status HTTP real.
 */

import type { H3Event } from 'h3'

import type { ApiErrorBody, ApiErrorCode } from '../../app/api/types'

class MockApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: ApiErrorCode,
    message: string,
    readonly details?: Record<string, unknown>
  ) {
    super(message)
  }
}

/** Corta el handler y responde `ApiErrorBody` con ese status. */
export function apiError(status: number, code: ApiErrorCode, message: string, details?: Record<string, unknown>): never {
  throw new MockApiError(status, code, message, details)
}

/** Atajo para `422 validation_error` con el error de cada campo en `details.fields`. */
export function validationError(fields: Record<string, string>): never {
  apiError(422, 'validation_error', 'Datos inválidos', { fields })
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * Handler del mock: simula la latencia de red y convierte cualquier falla en `ApiErrorBody`
 * (lo que no sea `apiError()` sale como `500 internal_error`).
 */
export function defineMockHandler<T>(latencyMs: number, handler: (event: H3Event) => T | Promise<T>) {
  return defineEventHandler(async (event): Promise<T | ApiErrorBody> => {
    await wait(latencyMs)
    try {
      return await handler(event)
    }
    catch (error) {
      if (!(error instanceof MockApiError)) console.error('[mock-api]', error)
      const { status, code, message, details } = error instanceof MockApiError
        ? error
        : new MockApiError(500, 'internal_error', 'Error interno')
      setResponseStatus(event, status)
      return { error: { code, message, ...(details && { details }) } }
    }
  })
}
