<script setup lang="ts">
/**
 * `open`: punto verde de "abierto ahora", como el "en línea" de un chat (cerrado: sin punto).
 * `src`: logo del negocio; sin él se muestra el ícono del giro.
 */
withDefaults(
  defineProps<{ icon: string, src?: string, size?: 'sm' | 'md' | 'lg' | 'xl', open?: boolean }>(),
  { size: 'md', open: false }
)

const sizes = {
  sm: { box: 'size-9', icon: '18', dot: 'size-2.5 right-0 bottom-0 ring-2' },
  md: { box: 'size-10', icon: '22', dot: 'size-2.5 right-0 bottom-0 ring-2' },
  lg: { box: 'size-14', icon: '28', dot: 'size-3.5 right-0 bottom-0 ring-2' },
  xl: { box: 'size-28 md:size-36', icon: '56', dot: 'size-5 right-1.5 bottom-1.5 ring-4' }
}
</script>

<template>
  <!-- Los negocios usan el icono de su giro (no iniciales) para distinguirse de las personas -->
  <span
    class="relative inline-flex shrink-0 items-center justify-center rounded-full bg-veci-gradient text-on-primary"
    :class="sizes[size].box"
    aria-hidden="true"
  >
    <img v-if="src" :src="src" alt="" class="size-full rounded-full object-cover">
    <Icon v-else :name="icon" :size="sizes[size].icon" />
    <span v-if="open" class="absolute rounded-full bg-success ring-surface-card" :class="sizes[size].dot" />
  </span>
</template>
