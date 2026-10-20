<script setup lang="ts">
import { bottomNav, youNav } from '~/features/navigation/nav'
import { useCurrentUser } from '~/features/people/queries'

/**
 * Barra inferior (solo celular): Inicio · Ofertas · Citas (las vistas del feed) y "Tú",
 * que abre un panel con Mis cosas y Guardados. Explorar está en la lupa de la barra superior.
 */
const route = useRoute()
const counters = useNavCounters()
const { data: me } = useCurrentUser()

/** Activo si coinciden la ruta y la pestaña del feed (`?tab=`). */
function isActive(to: string) {
  const [path, query = ''] = to.split('?')
  const tab = new URLSearchParams(query).get('tab') ?? undefined
  return route.path === path && (route.query.tab ?? undefined) === tab
}

const youOpen = ref(false)
const youActive = computed(() => youOpen.value || youNav.some((item) => route.path.startsWith(item.to)))
// Al elegir una opción del panel se navega: el panel se cierra solo
watch(() => route.fullPath, () => (youOpen.value = false))
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-canvas/95 backdrop-blur md:hidden"
    aria-label="Navegación inferior"
  >
    <ul class="grid grid-cols-4">
      <li v-for="item in bottomNav" :key="item.label">
        <NuxtLink
          :to="item.to"
          class="relative flex flex-col items-center gap-xxs py-sm transition-colors"
          :class="isActive(item.to) ? 'text-on-dark' : 'text-muted'"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <Icon :name="isActive(item.to) ? item.activeIcon : item.icon" size="24" aria-hidden="true" />
          <span class="text-body-xs font-medium">{{ item.label }}</span>
        </NuxtLink>
      </li>

      <!-- Tú: tu foto (con aro si estás en lo tuyo) y el contador de pendientes -->
      <li>
        <button
          type="button"
          class="relative flex w-full flex-col items-center gap-xxs py-sm transition-colors"
          :class="youActive ? 'text-on-dark' : 'text-muted'"
          :aria-expanded="youOpen"
          aria-haspopup="dialog"
          @click="youOpen = true"
        >
          <SocialAvatar
            :name="me?.name ?? '?'"
            size="xs"
            class="ring-2 ring-offset-1 ring-offset-canvas"
            :class="youActive ? 'ring-on-dark' : 'ring-transparent'"
          />
          <span class="text-body-xs font-medium">Tú</span>
          <span
            v-if="counters.mine"
            class="absolute top-xxs left-1/2 ml-xs min-w-4 rounded-pill bg-veci-pink px-xxs text-center text-[10px] font-medium leading-4 text-on-accent"
          >
            {{ counters.mine }}
          </span>
        </button>
      </li>
    </ul>

    <BSheet v-model:open="youOpen" :title="me?.name ?? 'Tú'">
      <ul class="flex flex-col gap-xxs">
        <li v-for="item in youNav" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="flex items-center gap-md rounded-control px-sm py-sm transition-colors hover:bg-surface-elevated"
            :class="{ 'bg-surface-elevated': route.path.startsWith(item.to) }"
          >
            <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-veci-purple-text">
              <Icon :name="item.activeIcon" size="22" aria-hidden="true" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-body-md font-medium text-ink">{{ item.label }}</span>
              <span class="block text-body-xs text-muted">{{ item.hint }}</span>
            </span>
            <span
              v-if="item.counter && counters[item.counter]"
              class="min-w-5 rounded-pill bg-veci-pink px-xs text-center text-body-xs font-medium leading-5 text-on-accent tabular-nums"
            >
              {{ counters[item.counter] }}
            </span>
            <Icon name="material-symbols:chevron-right" size="20" class="text-muted" aria-hidden="true" />
          </NuxtLink>
        </li>
      </ul>
    </BSheet>
  </nav>
</template>
