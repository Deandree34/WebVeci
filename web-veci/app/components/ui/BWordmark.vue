<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md', to?: string }>(), { size: 'sm', to: '/' })
</script>

<template>
  <NuxtLink :to="to" class="inline-flex items-center" aria-label="VECI, inicio">
    <img
      src="/veci_logo.webp"
      alt="VECI"
      width="256"
      height="256"
      :class="size === 'md' ? 'size-12' : 'size-10'"
    >
  </NuxtLink>
</template>
