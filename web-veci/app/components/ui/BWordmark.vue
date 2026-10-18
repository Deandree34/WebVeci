<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md', to?: string }>(), { size: 'sm', to: '/' })
</script>

<template>
  <NuxtLink :to="to" class="inline-flex items-center" aria-label="VECI, inicio">
    <img
      src="/veci_logo_claro.webp"
      alt="VECI"
      width="787"
      height="678"
      :class="size === 'md' ? 'h-12 w-auto' : 'h-8 w-auto'"
    >
  </NuxtLink>
</template>
