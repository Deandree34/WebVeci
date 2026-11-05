<script setup lang="ts">
import type { SocialNavLink } from '../nav'
import { youNav } from '../nav'
import { useCurrentUser } from '#layers/people/queries'

/**
 * Menú de opciones del celular (tres puntos, a la izquierda del buscador): abre un panel con
 * tu colonia, Explorar, Mis cosas y Guardados. Solo en celular: desde tablet están en la columna
 * izquierda y la colonia en el buscador.
 */

const route = useRoute()
const counters = useNavCounters()
const { data: me } = useCurrentUser()
const colony = useColony()
const colonyLabel = computed(() => `Cambiar colonia (${colony.value})`)

const open = ref(false)
// Al elegir una opción del panel se navega: el panel se cierra solo
watch(() => route.fullPath, () => {
  open.value = false
})

function openMenu() {
  open.value = true
}

function isCurrent(item: SocialNavLink) {
  return route.path.startsWith(item.to)
}

/** Cuánto muestra el contador del ítem (0 = sin contador). */
function countFor(item: SocialNavLink) {
  if (!item.counter) return 0
  return counters[item.counter]
}

const items = youNav
</script>

<template>
  <button
    type="button"
    aria-label="Menú"
    title="Menú"
    class="relative inline-flex h-10 w-8 shrink-0 items-center justify-center rounded-full text-body-strong transition-colors hover:bg-surface-elevated"
    :aria-expanded="open"
    aria-haspopup="dialog"
    @click="openMenu"
  >
    <!-- Tres puntos sin círculo de fondo: más ligero que las acciones de la derecha -->
    <Icon name="material-symbols:more-vert" size="24" aria-hidden="true" />
    <BCounter v-if="counters.mine" :value="counters.mine" class="absolute top-0.5 right-0.5" />
  </button>

  <BSheet v-model:open="open" title="Menú" :subtitle="me?.name">
    <!-- Tu colonia (en celular no cabe en el buscador): misma fila que las opciones; al tocarla se podrá cambiar -->
    <button
      type="button"
      class="flex w-full items-center gap-md rounded-control px-sm py-sm text-left transition-colors hover:bg-surface-elevated"
      :aria-label="colonyLabel"
    >
      <BIconCircle icon="material-symbols:location-on" />
      <span class="min-w-0 flex-1">
        <span class="block text-body-md font-medium text-ink">{{ colony }}</span>
        <span class="block text-body-xs text-muted">Tu colonia · tócala para cambiarla</span>
      </span>
      <Icon name="material-symbols:expand-more" size="20" class="text-muted" aria-hidden="true" />
    </button>
    <hr class="my-xs border-hairline">

    <ul class="flex flex-col gap-xxs">
      <li v-for="item in items" :key="item.to">
        <NuxtLink
          :to="item.to"
          class="flex items-center gap-md rounded-control px-sm py-sm transition-colors hover:bg-surface-elevated"
          :class="{ 'bg-surface-elevated': isCurrent(item) }"
        >
          <!-- Ícono en círculo neutro, como en Mis cosas (solo neutros) -->
          <BIconCircle :icon="item.activeIcon" />
          <span class="min-w-0 flex-1">
            <span class="block text-body-md font-medium text-ink">{{ item.label }}</span>
            <span class="block text-body-xs text-muted">{{ item.hint }}</span>
          </span>
          <BCounter v-if="countFor(item)" :value="countFor(item)" size="md" />
          <Icon name="material-symbols:chevron-right" size="20" class="text-muted" aria-hidden="true" />
        </NuxtLink>
      </li>
    </ul>
  </BSheet>
</template>
