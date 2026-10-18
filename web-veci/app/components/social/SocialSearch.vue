<script setup lang="ts">
withDefaults(defineProps<{ placeholder?: string }>(), { placeholder: 'Buscar en VECI' })

const model = defineModel<string>({ default: '' })
</script>

<template>
  <label class="flex h-10 w-full items-center gap-sm rounded-pill bg-surface-elevated px-md">
    <Icon name="material-symbols:search" size="20" class="text-muted" aria-hidden="true" />
    <span class="sr-only">Buscar</span>
    <input
      v-model="model"
      type="search"
      :placeholder="placeholder"
      class="h-full w-full min-w-0 bg-transparent text-body-sm text-on-dark placeholder:text-muted-soft focus:outline-none"
    >
  </label>
</template>
