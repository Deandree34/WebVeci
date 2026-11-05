import { useQueryClient } from '@tanstack/vue-query'

import { businessesOptions } from '#layers/business/queries'
import { categoriesOptions } from '#layers/category/queries'
import { noticesOptions } from '#layers/notice/queries'
import { notificationsOptions } from '#layers/notification/queries'
import { meOptions } from '#layers/people/queries'
import { storiesOptions } from '#layers/story/queries'

/**
 * Precarga en SSR de los datos del shell (historias, categorías, negocios, avisos,
 * notificaciones —cuyo contador va en la navegación— y la cuenta del vecino):
 * el HTML inicial ya llega con contenido y el estado deshidratado coincide con
 * lo renderizado (sin parpadeo ni desajustes de hidratación). En el cliente los
 * componentes muestran brevemente su estado de carga mientras TanStack resuelve.
 *
 * Se llama desde los layouts —y no desde la página— porque el layout se
 * renderiza antes que las páginas.
 */
export async function useShellPrefetch() {
  if (!import.meta.server) return
  const queryClient = useQueryClient()

  await Promise.all([
    queryClient.prefetchQuery(storiesOptions),
    queryClient.prefetchQuery(categoriesOptions),
    queryClient.prefetchQuery(businessesOptions()),
    queryClient.prefetchQuery(noticesOptions),
    queryClient.prefetchQuery(notificationsOptions),
    queryClient.prefetchQuery(meOptions)
  ])
}
