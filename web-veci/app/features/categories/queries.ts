import { queryOptions, useQuery } from '@tanstack/vue-query'

import { categoriesApi } from '~/api/categories'

/** Claves de caché del dominio categories (para invalidación selectiva). */
export const categoryKeys = {
  all: ['categories'] as const
}

/** Opciones reutilizables: alimentan los componentes y la precarga en SSR. */
export const categoriesOptions = queryOptions({
  queryKey: categoryKeys.all,
  queryFn: () => categoriesApi.list(),
  // El catálogo casi no cambia
  staleTime: 60 * 60_000
})

/** Catálogo de categorías (disponibles y "Próximamente"). */
export function useCategories() {
  return useQuery(categoriesOptions)
}
