import { useQueryClient } from '@tanstack/vue-query'

import { businessesOptions } from '~/features/businesses/queries'
import { categoriesOptions } from '~/features/categories/queries'
import { noticesOptions } from '~/features/notices/queries'
import { notificationsOptions } from '~/features/notifications/queries'
import { storiesOptions } from '~/features/stories/queries'

/**
 * Precarga en SSR de los datos del shell (historias, categorías, negocios, avisos y
 * notificaciones, cuyo contador va en la navegación):
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
    queryClient.prefetchQuery(notificationsOptions)
  ])
}
