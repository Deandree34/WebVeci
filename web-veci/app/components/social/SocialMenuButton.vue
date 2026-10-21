<script setup lang="ts">
import { youNav } from '~/features/navigation/nav'
import { useCurrentUser } from '~/features/people/queries'

/**
 * Menú de opciones del celular (tres puntos, a la izquierda del buscador): abre un panel con
 * tu colonia, Explorar, Mis cosas y Guardados. Solo en celular: desde tablet están en la columna izquierda y la colonia en el buscador.
 */
const route = useRoute()
const counters = useNavCounters()
const { data: me } = useCurrentUser()
const colony = useColony()

const open = ref(false)
// Al elegir una opción del panel se navega: el panel se cierra solo
watch(() => route.fullPath, () => (open.value = false))
</script>

<template>
  <button
    type="button"
    aria-label="Menú"
    title="Menú"
    class="relative inline-flex h-10 w-8 shrink-0 items-center justify-center rounded-full text-body-strong transition-colors hover:bg-surface-elevated"
    :aria-expanded="open"
    aria-haspopup="dialog"
    @click="open = true"
  >
    <!-- Tres puntos sin círculo de fondo: más ligero que las acciones de la derecha -->
    <Icon name="material-symbols:more-vert" size="24" aria-hidden="true" />
    <span
      v-if="counters.mine"
      class="absolute top-0.5 right-0.5 min-w-4 rounded-pill bg-brand px-xxs text-center font-headline text-tiny font-bold leading-4 text-on-brand"
    >
      {{ counters.mine }}
    </span>
  </button>

  <BSheet v-model:open="open" title="Menú" :subtitle="me?.name">
    <!-- Tu colonia (en celular no cabe en el buscador): misma fila que las opciones; al tocarla se podrá cambiar -->
    <button
      type="button"
      class="flex w-full items-center gap-md rounded-control px-sm py-sm text-left transition-colors hover:bg-surface-elevated"
      :aria-label="`Cambiar colonia (${colony})`"
    >
      <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-ink">
        <Icon name="material-symbols:location-on" size="22" aria-hidden="true" />
      </span>
      <span class="min-w-0 flex-1">
        <span class="block text-body-md font-medium text-ink">{{ colony }}</span>
        <span class="block text-body-xs text-muted">Tu colonia · tócala para cambiarla</span>
      </span>
      <Icon name="material-symbols:expand-more" size="20" class="text-muted" aria-hidden="true" />
    </button>
    <hr class="my-xs border-hairline">

    <ul class="flex flex-col gap-xxs">
      <li v-for="item in youNav" :key="item.to">
        <NuxtLink
          :to="item.to"
          class="flex items-center gap-md rounded-control px-sm py-sm transition-colors hover:bg-surface-elevated"
          :class="{ 'bg-surface-elevated': route.path.startsWith(item.to) }"
        >
          <!-- Ícono en círculo neutro, como en Mis cosas (solo neutros) -->
          <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-ink">
            <Icon :name="item.activeIcon" size="22" aria-hidden="true" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-body-md font-medium text-ink">{{ item.label }}</span>
            <span class="block text-body-xs text-muted">{{ item.hint }}</span>
          </span>
          <span
            v-if="item.counter && counters[item.counter]"
            class="min-w-5 rounded-pill bg-brand px-xs text-center font-headline text-meta font-bold leading-5 text-on-brand tabular-nums"
          >
            {{ counters[item.counter] }}
          </span>
          <Icon name="material-symbols:chevron-right" size="20" class="text-muted" aria-hidden="true" />
        </NuxtLink>
      </li>
    </ul>
  </BSheet>
</template>
