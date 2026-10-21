C:\GithubProjects\Veci\WebVeci\web-veci\post.png<script setup lang="ts">
import type { HomeTab } from '~/api/types'

/**
 * Pestañas del inicio al estilo Facebook: solo íconos (relleno = activa, contorno = inactiva),
 * barra degradada al ~90 % de la activa y descripción al pasar el cursor o enfocar con teclado.
 * `undefined` = "Para ti" (todo). Notificaciones lleva el contador de las no leídas.
 * Solo desde tablet: en celular estas vistas van en la barra inferior.
 */
const tab = defineModel<HomeTab | undefined>()
const counters = useNavCounters()

const tabs: { value: HomeTab | undefined, label: string, hint: string, icon: string, iconActive: string }[] = [
  { value: undefined, label: 'Para ti', hint: 'Todo lo de tu colonia', icon: 'material-symbols:home-outline', iconActive: 'material-symbols:home' },
  { value: 'ofertas', label: 'Ofertas', hint: 'Promociones con fecha de fin', icon: 'material-symbols:sell-outline', iconActive: 'material-symbols:sell' },
  { value: 'citas', label: 'Citas', hint: 'Negocios con lugar disponible', icon: 'material-symbols:calendar-month-outline', iconActive: 'material-symbols:calendar-month' },
  { value: 'notificaciones', label: 'Notificaciones', hint: 'Lo nuevo de tus negocios y tu colonia', icon: 'material-symbols:notifications-outline', iconActive: 'material-symbols:notifications' }
]
</script>

<template>
  <!-- Fijas bajo el encabezado al hacer scroll; sin línea divisoria -->
  <div
    class="sticky top-14 z-20 mb-md hidden bg-canvas/95 px-xs backdrop-blur md:flex"
    role="tablist"
    aria-label="Filtrar el feed"
  >
    <button
      v-for="option in tabs"
      :key="option.label"
      type="button"
      role="tab"
      :aria-selected="tab === option.value"
      :aria-label="`${option.label}: ${option.hint}`"
      class="group relative flex-1 focus-visible:outline-none"
      @click="tab = option.value"
    >
      <span
        class="mx-xxs my-xxs flex h-11 items-center justify-center rounded-control transition-colors group-hover:bg-surface-soft group-focus-visible:bg-surface-soft"
        :class="tab === option.value ? 'text-on-dark' : 'text-muted group-hover:text-on-dark'"
      >
        <span class="relative inline-flex">
          <Icon :name="tab === option.value ? option.iconActive : option.icon" size="26" aria-hidden="true" />
          <!-- Sin leer: contador neutro sobre la campana -->
          <span
            v-if="option.value === 'notificaciones' && counters.notifications"
            class="absolute -top-1 left-1/2 ml-xxs min-w-[18px] rounded-pill bg-ink px-xxs text-center font-headline text-tiny leading-[18px] font-bold text-canvas"
            :aria-label="`${counters.notifications} sin leer`"
          >{{ counters.notifications }}</span>
        </span>
      </span>

      <span
        v-if="tab === option.value"
        class="absolute bottom-0 left-1/2 h-1 w-[90%] -translate-x-1/2 rounded-pill bg-brand"
        aria-hidden="true"
      />

      <!-- Descripción: aparece tras un instante (no al pasar de largo) y se oculta al salir.
           group-hover en Tailwind v4 solo aplica en dispositivos con cursor. -->
      <span
        role="tooltip"
        class="pointer-events-none invisible absolute top-full left-1/2 z-30 mt-xs w-max -translate-x-1/2 rounded-control bg-surface-elevated px-sm py-xs text-left opacity-0 shadow-lg transition-opacity delay-0 group-hover:visible group-hover:opacity-100 group-hover:delay-300 group-focus-visible:visible group-focus-visible:opacity-100"
      >
        <span class="block text-body-sm font-bold text-on-dark">{{ option.label }}</span>
        <span class="block text-body-xs text-muted">{{ option.hint }}</span>
      </span>
    </button>
  </div>
</template>
