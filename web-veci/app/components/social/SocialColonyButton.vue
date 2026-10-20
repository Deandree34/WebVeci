<script setup lang="ts">
/** Colonia actual; al tocarla se podrá cambiar (por ahora es visual). Única fuente del estilo. */
const colony = 'Col. Centro'
</script>

<template>
  <button
    type="button"
    :title="`Cambiar colonia (${colony})`"
    :aria-label="`Cambiar colonia (${colony})`"
    class="inline-flex h-8 shrink-0 items-center gap-xxs rounded-pill px-sm text-body-sm font-medium whitespace-nowrap text-on-dark transition-colors hover:bg-hairline-strong"
  >
    <Icon name="material-symbols:location-on" size="18" class="text-veci-purple-text" aria-hidden="true" />
    {{ colony }}
    <Icon name="material-symbols:expand-more" size="18" class="text-muted" aria-hidden="true" />
  </button>
</template>
