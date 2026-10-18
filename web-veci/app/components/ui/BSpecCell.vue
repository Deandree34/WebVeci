<script setup lang="ts">
defineProps<{ label: string, value: string }>()
</script>

<template>
  <div class="border-t border-hairline py-lg text-on-dark">
    <p class="type-caption mb-xs text-muted">{{ label }}</p>
    <p class="font-display text-title-md uppercase">{{ value }}</p>
  </div>
</template>
