import { queryOptions, useQuery } from '@tanstack/vue-query'

import { notificationsApi } from './api'

/** Claves de caché del dominio notifications (para invalidación selectiva). */
export const notificationKeys = {
  all: ['notifications'] as const
}

/**
 * Opciones reutilizables: alimentan el componente y la precarga en SSR.
 * El endpoint responde una página (`{ items, nextCursor }`); la vista consume solo los items.
 */
export const notificationsOptions = queryOptions({
  queryKey: notificationKeys.all,
  queryFn: () => notificationsApi.list(),
  select: (page) => page.items
})

/** Notificaciones del vecino (vista "Notificaciones" del inicio y su contador). */
export function useNotifications() {
  return useQuery(notificationsOptions)
}
