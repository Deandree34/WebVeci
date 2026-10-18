<script setup lang="ts">
defineProps<{ icon: string, title: string }>()
</script>

<template>
  <div class="flex flex-col items-center rounded-card bg-surface-card px-lg py-xl text-center">
    <Icon :name="icon" size="40" class="mb-sm text-muted" aria-hidden="true" />
    <p class="text-body-md font-medium text-on-dark">{{ title }}</p>
    <p v-if="$slots.default" class="mt-xxs max-w-copy text-body-sm text-muted"><slot /></p>
    <div v-if="$slots.actions" class="mt-md"><slot name="actions" /></div>
  </div>
</template>
