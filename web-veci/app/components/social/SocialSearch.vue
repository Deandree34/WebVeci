<script setup lang="ts">
/**
 * Buscador; el slot `end` va al final, tras un separador (p. ej. la colonia).
 * Lo que escribe el vecino va en la fuente del sistema; la pregunta de la app (placeholder), en Lora cursiva.
 */
withDefaults(defineProps<{ placeholder?: string, endClass?: string }>(), { placeholder: 'Buscar en VECI' })

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="flex h-10 items-center rounded-pill bg-surface-elevated pr-xxs">
    <label class="flex h-full min-w-0 flex-1 items-center gap-xs pl-sm sm:gap-sm sm:pl-md">
      <Icon name="material-symbols:search" size="20" class="shrink-0 text-muted" aria-hidden="true" />
      <span class="sr-only">Buscar</span>
      <input
        v-model="model"
        type="search"
        :placeholder="placeholder"
        class="h-full w-full min-w-0 bg-transparent text-copy text-ink placeholder:font-quote placeholder:text-muted placeholder:italic focus:outline-none"
      >
    </label>
    <!-- `endClass` permite ocultar el final (separador incluido) según el ancho, p. ej. "hidden md:flex" -->
    <span v-if="$slots.end" class="shrink-0 items-center" :class="endClass ?? 'flex'">
      <span class="mx-xxs h-6 w-px shrink-0 bg-hairline-strong" aria-hidden="true" />
      <slot name="end" />
    </span>
  </div>
</template>
