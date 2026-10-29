/** Endpoints de negocios. */

import { api } from '~/api/client'
import type { Business } from '~/api/types'

export const businessesApi = {
  /** Negocios de la colonia, opcionalmente filtrados por categoría (`slug`). */
  list: (category?: string) => api<Business[]>('/businesses', { query: { category } }),

  /** Detalle de un negocio por `slug`; `not_found` (404) si no existe. */
  get: (slug: string) => api<Business>(`/businesses/${encodeURIComponent(slug)}`)
}
