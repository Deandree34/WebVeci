<script setup lang="ts">
/**
 * Calificación como 5 estrellas rellenas en proporción al valor (4.9 → 98 %): una capa de
 * estrellas tenues y encima la misma capa en blanco, recortada al porcentaje. Solo neutros.
 */
const props = withDefaults(defineProps<{ value: number, size?: number }>(), { size: 16 })

const fill = computed(() => `${Math.max(0, Math.min(5, props.value)) * 20}%`)
</script>

<template>
  <span class="relative inline-flex shrink-0 align-middle" role="img" :aria-label="`${value} de 5 estrellas`">
    <span class="flex text-hairline-strong" aria-hidden="true">
      <Icon v-for="n in 5" :key="n" name="material-symbols:star-rounded" :size="size" class="shrink-0" />
    </span>
    <span class="absolute inset-y-0 left-0 flex overflow-hidden text-brand" :style="{ width: fill }" aria-hidden="true">
      <Icon v-for="n in 5" :key="n" name="material-symbols:star-rounded" :size="size" class="shrink-0" />
    </span>
  </span>
</template>
