<script setup lang="ts">
import type { HomeTab } from '~/api/types'

/**
 * Pestañas del inicio en el centro del encabezado, al estilo Facebook: solo íconos (relleno = activa,
 * contorno = inactiva), barra ocre bajo la activa y descripción al pasar el cursor o enfocar con teclado.
 * Son enlaces a `/?tab=…`: desde cualquier página llevan al inicio en esa vista; solo se marcan activas en el inicio.
 * Solo desde tablet: en celular estas vistas van en la barra inferior.
 */
const route = useRoute()
const counters = useNavCounters()

const tabs: { value: HomeTab | undefined, label: string, hint: string, icon: string, iconActive: string }[] = [
  { value: undefined, label: 'Para ti', hint: 'Todo lo de tu colonia', icon: 'material-symbols:home-outline', iconActive: 'material-symbols:home' },
  { value: 'ofertas', label: 'Ofertas', hint: 'Promociones con fecha de fin', icon: 'material-symbols:sell-outline', iconActive: 'material-symbols:sell' },
  { value: 'citas', label: 'Citas', hint: 'Negocios con lugar disponible', icon: 'material-symbols:calendar-month-outline', iconActive: 'material-symbols:calendar-month' },
  { value: 'notificaciones', label: 'Notificaciones', hint: 'Lo nuevo de tus negocios y tu colonia', icon: 'material-symbols:notifications-outline', iconActive: 'material-symbols:notifications' }
]

const onHome = computed(() => route.path === '/')
const isActive = (value: HomeTab | undefined) => onHome.value && (route.query.tab ?? undefined) === value

// Al cambiar de vista se empieza desde arriba (la lista nueva no tiene que ver con donde ibas)
function onSelect() {
  window.scrollTo({ top: 0 })
}
</script>

<template>
  <!-- Sin `flex` propio: quien lo usa decide cuándo se muestra (p. ej. "hidden md:flex") -->
  <nav class="h-14 items-stretch" aria-label="Vistas del inicio">
    <NuxtLink
      v-for="option in tabs"
      :key="option.label"
      :to="{ path: '/', query: option.value ? { tab: option.value } : {} }"
      :replace="onHome"
      :aria-current="isActive(option.value) ? 'page' : undefined"
      :aria-label="`${option.label}: ${option.hint}`"
      class="group relative flex w-16 items-center justify-center focus-visible:outline-none lg:w-20 2xl:w-24"
      @click="onSelect"
    >
      <span
        class="flex h-11 w-full items-center justify-center rounded-control transition-colors group-hover:bg-surface-elevated group-focus-visible:bg-surface-elevated"
        :class="isActive(option.value) ? 'text-on-dark' : 'text-muted group-hover:text-on-dark'"
      >
        <span class="relative inline-flex">
          <Icon :name="isActive(option.value) ? option.iconActive : option.icon" size="26" aria-hidden="true" />
          <!-- Sin leer: contador ocre sobre la campana -->
          <span
            v-if="option.value === 'notificaciones' && counters.notifications"
            class="absolute -top-1 left-1/2 ml-xxs min-w-[18px] rounded-pill bg-brand px-xxs text-center font-headline text-tiny leading-[18px] font-bold text-on-brand"
            :aria-label="`${counters.notifications} sin leer`"
          >{{ counters.notifications }}</span>
        </span>
      </span>

      <!-- Barra de la activa, pegada al borde inferior del encabezado -->
      <span
        v-if="isActive(option.value)"
        class="absolute bottom-0 left-1/2 h-1 w-[90%] -translate-x-1/2 rounded-pill bg-brand"
        aria-hidden="true"
      />

      <!-- Descripción: aparece tras un instante (no al pasar de largo) y se oculta al salir.
           group-hover en Tailwind v4 solo aplica en dispositivos con cursor. -->
      <span
        role="tooltip"
        class="pointer-events-none invisible absolute top-full left-1/2 z-40 mt-xs w-max -translate-x-1/2 rounded-control bg-surface-elevated px-sm py-xs text-left opacity-0 shadow-lg transition-opacity delay-0 group-hover:visible group-hover:opacity-100 group-hover:delay-300 group-focus-visible:visible group-focus-visible:opacity-100"
      >
        <span class="block text-body-sm font-bold text-on-dark">{{ option.label }}</span>
        <span class="block text-body-xs text-muted">{{ option.hint }}</span>
      </span>
    </NuxtLink>
  </nav>
</template>
