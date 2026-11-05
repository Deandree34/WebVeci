import { queryOptions, useQuery } from '@tanstack/vue-query'

import { storiesApi } from './api'

/** Claves de caché del dominio stories (para invalidación selectiva). */
export const storyKeys = {
  all: ['stories'] as const
}

/** Opciones reutilizables: alimentan el componente y la precarga en SSR. */
export const storiesOptions = queryOptions({
  queryKey: storyKeys.all,
  queryFn: () => storiesApi.list()
})

/** Historias del raíl superior del feed. */
export function useStories() {
  return useQuery(storiesOptions)
}
