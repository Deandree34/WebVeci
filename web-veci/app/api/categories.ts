/**
 * Endpoints de categorías (giros).
 *
 * ⚠️ TEMPORAL — datos dummy con latencia simulada.
 * Cuando exista el backend, este archivo pasa a llamar a la API real.
 */

import { categories } from './mock/categories'
import type { Category } from './types'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export const categoriesApi = {
  /** Catálogo completo (disponibles y "Próximamente"). */
  async list(): Promise<Category[]> {
    await wait(80)
    return categories
  }
}
