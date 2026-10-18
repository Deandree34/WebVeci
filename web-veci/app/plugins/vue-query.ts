import { QueryClient, VueQueryPlugin, dehydrate, hydrate } from '@tanstack/vue-query'
import type { DehydratedState } from '@tanstack/vue-query'

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
        retry: 1
      }
    }
  })

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })

  if (import.meta.server) {
    nuxtApp.hooks.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient)
    })
  }

  if (import.meta.client) {
    hydrate(queryClient, vueQueryState.value)
  }
})
