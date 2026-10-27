import { useQuery } from '@tanstack/vue-query'

import { currentUser, peopleApi } from './api'

/** Claves de caché del dominio people (para invalidación selectiva). */
export const peopleKeys = {
  me: ['people', 'me'] as const
}

/** Cuenta autenticada (con `initialData` para no parpadear en el primer render). */
export function useCurrentUser() {
  return useQuery({
    queryKey: peopleKeys.me,
    queryFn: () => peopleApi.me(),
    initialData: currentUser
  })
}
