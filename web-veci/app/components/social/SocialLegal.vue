<script setup lang="ts">
/** Pie legal (único): términos y condiciones + copyright. El año sale de la fecha de la colonia. */
const now = useNow()
const year = computed(() => colonyToday(now.value).slice(0, 4))
</script>

<template>
  <p class="px-sm text-meta text-muted-soft">
    <!-- TODO: la página /terminos aún no existe -->
    <NuxtLink to="/terminos" class="transition-colors hover:text-muted hover:underline">Términos y condiciones</NuxtLink>
    <span class="mx-1" aria-hidden="true">·</span>
    <span>© {{ year }} VECI</span>
  </p>
</template>
