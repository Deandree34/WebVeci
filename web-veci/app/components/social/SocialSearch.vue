<script setup lang="ts">
/** Buscador; el slot `end` va al final, tras un separador (p. ej. la colonia). */
withDefaults(defineProps<{ placeholder?: string }>(), { placeholder: 'Buscar en VECI' })

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="flex h-10 items-center rounded-pill bg-surface-elevated pr-xxs">
    <label class="flex h-full min-w-0 flex-1 items-center gap-sm pl-md">
      <Icon name="material-symbols:search" size="20" class="shrink-0 text-muted" aria-hidden="true" />
      <span class="sr-only">Buscar</span>
      <input
        v-model="model"
        type="search"
        :placeholder="placeholder"
        class="h-full w-full min-w-0 bg-transparent text-body-sm text-on-dark placeholder:text-muted-soft focus:outline-none"
      >
    </label>
    <template v-if="$slots.end">
      <span class="mx-xxs h-6 w-px shrink-0 bg-hairline-strong" aria-hidden="true" />
      <slot name="end" />
    </template>
  </div>
</template>
