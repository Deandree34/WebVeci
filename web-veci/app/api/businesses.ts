/**
 * Endpoints de negocios.
 *
 * ⚠️ TEMPORAL — datos dummy con latencia simulada.
 * Cuando exista el backend, este archivo pasa a llamar a la API real:
 *
 *   list: (category?: string) => api('/businesses', { query: { category } }),
 *   get:  (slug: string) => api(`/businesses/${slug}`)
 */

import { businesses, findBusiness } from './mock/businesses'
import type { Business } from './types'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export const businessesApi = {
  /** Negocios de la colonia, opcionalmente filtrados por categoría (`slug`). */
  async list(category?: string): Promise<Business[]> {
    await wait(200)
    return category ? businesses.filter((business) => business.categoryId === category) : businesses
  },

  /** Detalle de un negocio por `slug`. */
  async get(slug: string): Promise<Business> {
    await wait(150)
    const business = findBusiness(slug)
    if (!business) throw new Error(`Negocio no encontrado: ${slug}`)
    return business
  }
}
