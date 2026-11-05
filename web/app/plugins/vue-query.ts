import { QueryClient, VueQueryPlugin, dehydrate, hydrate } from '@tanstack/vue-query'
import type { DehydratedState } from '@tanstack/vue-query'

import { ApiError } from '~/api/errors'

/**
 * Registra TanStack Query (estado de servidor) de forma **universal** (SSR + cliente).
 *
 * - En SSR cada request crea su propio `QueryClient` y, al terminar el render,
 *   **deshidrata** la caché en el payload (`useState`) para enviarla al navegador.
 * - En el cliente se **rehidrata** esa caché, evitando refetch y parpadeos.
 *
 * Las partes que además dependan de APIs del navegador o de formato no
 * determinista pueden seguir usando `<ClientOnly>`.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const vueQueryState = useState<DehydratedState | null>('vue-query')

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // Un 4xx (404, 422…) respondería igual: solo se reintentan la red y los 5xx
        retry: (failureCount, error) => failureCount < 1 && !(error instanceof ApiError && error.isClientError)
      }
    }
  })

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })

  if (import.meta.server) {
    nuxtApp.hooks.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient)
    })
  }

  // Sin estado (p. ej. una página sin SSR) no hay nada que rehidratar
  if (import.meta.client && vueQueryState.value) {
    hydrate(queryClient, vueQueryState.value)
  }
})
