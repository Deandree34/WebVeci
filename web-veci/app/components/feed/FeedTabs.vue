<script setup lang="ts">
import type { FeedTab } from '~/api/types'

/**
 * Pestañas del feed al estilo Facebook: solo íconos (relleno = activa, contorno = inactiva),
 * barra degradada al ~90 % de la activa y descripción al pasar el cursor o enfocar con teclado.
 * `undefined` = "Para ti" (todo). Solo desde tablet: en celular estas vistas van en la barra inferior.
 */
const tab = defineModel<FeedTab | undefined>()

const tabs: { value: FeedTab | undefined, label: string, hint: string, icon: string, iconActive: string }[] = [
  { value: undefined, label: 'Para ti', hint: 'Todo lo de tu colonia', icon: 'material-symbols:home-outline', iconActive: 'material-symbols:home' },
  { value: 'ofertas', label: 'Ofertas', hint: 'Promociones con fecha de fin', icon: 'material-symbols:sell-outline', iconActive: 'material-symbols:sell' },
  { value: 'citas', label: 'Citas', hint: 'Negocios con lugar disponible', icon: 'material-symbols:calendar-month-outline', iconActive: 'material-symbols:calendar-month' }
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
        <Icon :name="tab === option.value ? option.iconActive : option.icon" size="26" aria-hidden="true" />
      </span>

      <span
        v-if="tab === option.value"
        class="absolute bottom-0 left-1/2 h-1 w-[90%] -translate-x-1/2 rounded-pill bg-veci-gradient"
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
