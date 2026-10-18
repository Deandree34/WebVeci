<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'

import { businessesOptions } from '~/features/businesses/queries'
import { categoriesOptions } from '~/features/categories/queries'
import { storiesOptions } from '~/features/stories/queries'

/**
 * Precarga en SSR de los datos del shell (historias, categorías y negocios):
 * el HTML inicial ya llega con contenido y el estado deshidratado coincide con
 * lo renderizado (sin parpadeo ni desajustes de hidratación). En el cliente los
 * componentes muestran brevemente su estado de carga mientras TanStack resuelve.
 *
 * Se hace aquí —y no en la página— porque el layout se renderiza antes que
 * las páginas.
 */
if (import.meta.server) {
  const queryClient = useQueryClient()

  await Promise.all([
    queryClient.prefetchQuery(storiesOptions),
    queryClient.prefetchQuery(categoriesOptions),
    queryClient.prefetchQuery(businessesOptions())
  ])
}
</script>

<template>
  <div class="min-h-screen bg-canvas pb-14 md:pb-0">
    <SocialTopBar />

    <div class="mx-auto w-full max-w-app px-md">
      <div
        class="grid grid-cols-1 gap-lg
               md:grid-cols-[72px_minmax(0,1fr)]
               lg:grid-cols-[260px_minmax(0,1fr)]
               xl:grid-cols-[260px_minmax(0,1fr)_320px]"
      >
        <SocialSideNav />

        <main class="mx-auto w-full max-w-[680px] py-lg">
          <slot />
        </main>

        <SocialRightRail />
      </div>
    </div>

    <SocialBottomNav />
  </div>
</template>
