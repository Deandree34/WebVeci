<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    class="inline-flex size-10 items-center justify-center rounded-full bg-transparent text-on-dark transition-colors hover:bg-surface-elevated"
  >
    <slot />
  </button>
</template>
