<script setup lang="ts">
defineProps<{ to: string }>()
</script>

<template>
  <NuxtLink :to="to" class="type-button text-link underline-offset-4 hover:underline">
    <slot />
  </NuxtLink>
</template>
