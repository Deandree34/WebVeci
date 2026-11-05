<script setup lang="ts">
/**
 * Avatar de un negocio: el ícono de su giro (no iniciales, para distinguirse de las personas).
 * `src`: logo del negocio; sin él se muestra el ícono. `size`: sm · md (por defecto) · lg · xl.
 * `open`: punto verde de "abierto ahora", como el "en línea" de un chat (cerrado: sin punto).
 */
interface BusinessAvatarProps {
  icon: string
  src?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  open?: boolean
}

const SIZES = {
  sm: { box: 'size-9', icon: '18', dot: 'size-2.5 right-0 bottom-0 ring-2' },
  md: { box: 'size-10', icon: '22', dot: 'size-2.5 right-0 bottom-0 ring-2' },
  lg: { box: 'size-14', icon: '28', dot: 'size-3.5 right-0 bottom-0 ring-2' },
  xl: { box: 'size-28 md:size-36', icon: '56', dot: 'size-5 right-1.5 bottom-1.5 ring-4' }
}

const props = defineProps<BusinessAvatarProps>()

const sizing = computed(() => SIZES[props.size ?? 'md'])
</script>

<template>
  <!-- Los negocios usan el icono de su giro (no iniciales) para distinguirse de las personas -->
  <span
    class="relative inline-flex shrink-0 items-center justify-center rounded-full bg-brand text-on-brand"
    :class="sizing.box"
    aria-hidden="true"
  >
    <img v-if="src" :src="src" alt="" class="size-full rounded-full object-cover">
    <Icon v-else :name="icon" :size="sizing.icon" />
    <span v-if="open" class="absolute rounded-full bg-success ring-surface-card" :class="sizing.dot" />
  </span>
</template>
