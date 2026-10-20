<script setup lang="ts">
/** Colonia actual; al tocarla se podrá cambiar (por ahora es visual). Única fuente del estilo. */
const colony = 'Col. Centro'
</script>

<template>
  <button
    type="button"
    :title="`Cambiar colonia (${colony})`"
    :aria-label="`Cambiar colonia (${colony})`"
    class="inline-flex h-8 shrink-0 items-center gap-xxs rounded-pill px-sm font-headline text-[14px] font-semibold whitespace-nowrap text-ink transition-colors hover:bg-hairline-strong"
  >
    <!-- Pin en blanco (solo neutros) -->
    <Icon name="material-symbols:location-on" size="18" aria-hidden="true" />
    {{ colony }}
    <Icon name="material-symbols:expand-more" size="18" class="text-muted" aria-hidden="true" />
  </button>
</template>
