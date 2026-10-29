<script setup lang="ts">
/** Ícono en un círculo gris (Mis cosas, el menú, la confirmación de la cita). Decorativo. */
interface BIconCircleProps {
  icon: string
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = {
  sm: { box: 'size-9', icon: 20 },
  md: { box: 'size-10', icon: 22 },
  lg: { box: 'size-12', icon: 28 }
}

const props = defineProps<BIconCircleProps>()

const boxClass = computed(() => SIZES[props.size ?? 'md'].box)
const iconSize = computed(() => SIZES[props.size ?? 'md'].icon)
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center rounded-full bg-surface-elevated text-ink"
    :class="boxClass"
    aria-hidden="true"
  >
    <Icon :name="icon" :size="iconSize" />
  </span>
</template>
