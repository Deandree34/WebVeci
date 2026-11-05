import { queryOptions, useQuery } from '@tanstack/vue-query'

import { peopleApi } from './api'

/** Claves de caché del dominio people (para invalidación selectiva). */
export const peopleKeys = {
  me: ['people', 'me'] as const
}

/** Opciones reutilizables: alimentan los componentes y la precarga en SSR (`useShellPrefetch`). */
export const meOptions = queryOptions({
  queryKey: peopleKeys.me,
  queryFn: () => peopleApi.me(),
  // La cuenta casi no cambia durante la visita
  staleTime: 5 * 60_000
})

/** Cuenta autenticada (llega precargada desde SSR: no parpadea en el primer render). */
export function useCurrentUser() {
  return useQuery(meOptions)
}
