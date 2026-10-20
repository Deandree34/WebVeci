<script setup lang="ts">
/** Colonia actual dentro del buscador (desde md); al tocarla se podrá cambiar (por ahora es visual). */
const colony = useColony()
</script>

<template>
  <button
    type="button"
    :title="`Cambiar colonia (${colony})`"
    :aria-label="`Cambiar colonia (${colony})`"
    class="inline-flex h-8 shrink-0 items-center gap-xxs rounded-pill px-sm text-label font-semibold whitespace-nowrap text-ink transition-colors hover:bg-hairline-strong"
  >
    <!-- Pin en blanco (solo neutros) -->
    <Icon name="material-symbols:location-on" size="18" aria-hidden="true" />
    {{ colony }}
    <span class="inline-flex text-muted" aria-hidden="true"><Icon name="material-symbols:expand-more" size="18" /></span>
  </button>
</template>
