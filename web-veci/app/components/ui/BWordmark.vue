<script setup lang="ts">
/** Logo de VECI que lleva al inicio (o a `to`). `size`: sm 40px (por defecto) · md 48px. */
interface BWordmarkProps {
  size?: 'sm' | 'md'
  to?: string
}

const props = defineProps<BWordmarkProps>()

const link = computed(() => props.to ?? '/')
const sizeClass = computed(() => (props.size === 'md' ? 'size-12' : 'size-10'))
</script>

<template>
  <NuxtLink :to="link" class="inline-flex items-center" aria-label="VECI, inicio">
    <img
      src="/veci_logo.webp"
      alt="VECI"
      width="256"
      height="256"
      :class="sizeClass"
    >
  </NuxtLink>
</template>
