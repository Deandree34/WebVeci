import { queryOptions, useQuery } from '@tanstack/vue-query'

import { noticesApi } from '~/api/notices'

/** Claves de caché del dominio notices (para invalidación selectiva). */
export const noticeKeys = {
  all: ['notices'] as const
}

/** Opciones reutilizables: alimentan el componente y la precarga en SSR. */
export const noticesOptions = queryOptions({
  queryKey: noticeKeys.all,
  queryFn: () => noticesApi.list()
})

/** Próximos avisos de la colonia (columna derecha). */
export function useNotices() {
  return useQuery(noticesOptions)
}
