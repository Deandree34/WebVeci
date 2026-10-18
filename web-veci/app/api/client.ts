/**
 * Capa de acceso a red — punto único de configuración HTTP hacia el backend.
 *
 * Uso (dentro de setup / composables / handlers de Nitro, donde hay contexto Nuxt):
 *
 *   const api = createApiClient()
 *   const feed = await api('/feed', { query: { cursor } })
 *
 * Regla: los componentes y stores NUNCA llaman a `$fetch` directamente.
 * Consumen endpoints definidos en archivos hermanos (businesses.ts, feed.ts, …)
 * a través de TanStack Query en `features/<dominio>/queries.ts`.
 */
export function createApiClient() {
  const config = useRuntimeConfig()

  return $fetch.create({
    baseURL: config.public.apiBaseUrl as string,
    credentials: 'include',
    headers: { Accept: 'application/json' }
  })
}
