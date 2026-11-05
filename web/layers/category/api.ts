/** Endpoints de categorías (giros). */

import { api } from '~/api/client'
import type { Category } from '~/api/types'

export const categoriesApi = {
  /** Catálogo completo (disponibles y "Próximamente"). */
  list: () => api<Category[]>('/categories')
}
