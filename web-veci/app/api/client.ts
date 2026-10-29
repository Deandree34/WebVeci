/**
 * Capa de acceso a red — punto único de configuración HTTP hacia el backend.
 *
 * Uso (en `layers/<dominio>/api.ts`):
 *
 *   import { api } from '~/api/client'
 *   const page = await api<Paginated<FeedItem>>('/feed', { query: { cursor } })
 *
 * La URL base sale de `NUXT_PUBLIC_API_BASE_URL`:
 *   - `/api/v1` (por defecto) → el mock de Nitro en `server/api/v1/`;
 *   - `https://…/v1`          → el backend FastAPI real. Nada más cambia.
 *
 * Toda falla sale como `ApiError` (ver `./errors.ts`).
 *
 * Regla: los componentes y stores NUNCA llaman a `api` ni a `$fetch` directamente.
 * Consumen los endpoints de `layers/<dominio>/api.ts` a través de TanStack Query (`queries.ts`).
 */

import { toApiError } from './errors'

type ApiOptions = Parameters<typeof $fetch>[1]

let fetcher: typeof $fetch | undefined

/**
 * Crea la instancia base. La llama una sola vez el plugin `plugins/api.ts`, donde hay contexto
 * Nuxt: las queries de TanStack corren fuera de él (después de un `await`) y no podrían leer
 * `useRuntimeConfig()` por su cuenta.
 */
export function initApiClient(baseURL: string) {
  fetcher = $fetch.create({
    baseURL,
    credentials: 'include',
    headers: { Accept: 'application/json' }
  })
}

/** Petición a la API; responde el cuerpo ya parseado o lanza `ApiError`. */
export async function api<T>(path: string, options?: ApiOptions): Promise<T> {
  if (!fetcher) throw new Error('API sin inicializar: falta el plugin `plugins/api.ts`')
  try {
    return await fetcher<T>(path, options) as T
  }
  catch (error) {
    throw toApiError(error)
  }
}
