<script setup lang="ts">
/** `open`: punto verde de "abierto ahora", como el "en línea" de un chat (cerrado: sin punto). */
withDefaults(defineProps<{ icon: string, size?: 'sm' | 'md' | 'lg', open?: boolean }>(), { size: 'md', open: false })

const sizes = {
  sm: { box: 'size-9', icon: '18', dot: 'size-2.5' },
  md: { box: 'size-10', icon: '22', dot: 'size-2.5' },
  lg: { box: 'size-14', icon: '28', dot: 'size-3.5' }
}
</script>

<template>
  <!-- Los negocios usan el icono de su giro (no iniciales) para distinguirse de las personas -->
  <span
    class="relative inline-flex shrink-0 items-center justify-center rounded-full bg-veci-gradient text-on-primary"
    :class="sizes[size].box"
    aria-hidden="true"
  >
    <Icon :name="icon" :size="sizes[size].icon" />
    <span v-if="open" class="absolute right-0 bottom-0 rounded-full bg-success ring-2 ring-surface-card" :class="sizes[size].dot" />
  </span>
</template>
