<script setup lang="ts">
/** Partes de una línea unidas por "·" ("Manicure · Mañana 10:30 · $180"). Va dentro de un párrafo. */
interface BDotListProps {
  parts: string[]
}

defineProps<BDotListProps>()
</script>

<template>
  <template v-for="(part, i) in parts" :key="part">
    <BDot v-if="i" />{{ part }}
  </template>
</template>
