<script setup lang="ts">
defineProps<{ title: string, to?: string }>()

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to="to"
    class="flex items-center justify-between gap-md border-b border-hairline bg-transparent py-lg text-on-dark"
  >
    <span class="font-display text-title-md uppercase">{{ title }}</span>
    <span class="flex items-center gap-lg text-muted"><slot /></span>
  </component>
</template>
