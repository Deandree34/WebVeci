<script setup lang="ts">
/**
 * Colonia actual dentro del buscador (desde tablet); al tocarla se podrá cambiar (por ahora es visual).
 * `labelClass` permite dejar solo el pin cuando el buscador va justo, p. ej. "lg:max-xl:hidden".
 */
defineProps<{ labelClass?: string }>()
const colony = useColony()
</script>

<template>
  <button
    type="button"
    :title="`Cambiar colonia (${colony})`"
    :aria-label="`Cambiar colonia (${colony})`"
    class="inline-flex h-8 shrink-0 items-center gap-xxs rounded-pill px-xs text-label font-semibold whitespace-nowrap text-ink transition-colors hover:bg-hairline-strong sm:px-sm"
  >
    <!-- Pin en blanco (solo neutros) -->
    <Icon name="material-symbols:location-on" size="18" aria-hidden="true" />
    <span class="items-center gap-xxs" :class="labelClass ? `flex ${labelClass}` : 'flex'">
      {{ colony }}
      <span class="inline-flex text-muted" aria-hidden="true"><Icon name="material-symbols:expand-more" size="18" /></span>
    </span>
  </button>
</template>
