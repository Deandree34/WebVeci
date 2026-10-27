import { queryOptions, useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'

import { businessesApi } from './api'

/** Claves de caché del dominio businesses (para invalidación selectiva). */
export const businessKeys = {
  all: ['businesses'] as const,
  list: (category?: string) => ['businesses', 'list', category ?? 'all'] as const,
  detail: (slug: string) => ['businesses', 'detail', slug] as const
}

/** Opciones reutilizables: alimentan los componentes y la precarga en SSR. */
export const businessesOptions = (category?: string) => queryOptions({
  queryKey: businessKeys.list(category),
  queryFn: () => businessesApi.list(category)
})

export const businessOptions = (slug: string) => queryOptions({
  queryKey: businessKeys.detail(slug),
  queryFn: () => businessesApi.get(slug),
  // Un negocio inexistente no se reintenta (respondería 404 igual)
  retry: false
})

/** Negocios de la colonia, opcionalmente de una categoría. */
export function useBusinesses(category?: MaybeRefOrGetter<string | undefined>) {
  return useQuery(computed(() => businessesOptions(toValue(category))))
}

/** Detalle de un negocio por `slug`. */
export function useBusiness(slug: MaybeRefOrGetter<string>) {
  return useQuery(computed(() => businessOptions(toValue(slug))))
}
