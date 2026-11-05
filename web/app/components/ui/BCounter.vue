<script setup lang="ts">
/**
 * Contador ocre de la navegación (sin leer, Mis cosas, Guardados). `sm` (por defecto) va sobre un
 * ícono (la posición la pone quien lo usa, p. ej. `absolute -top-1`); `md`, al final de una fila.
 */
interface BCounterProps {
  value: number | string
  size?: 'sm' | 'md'
}

const props = defineProps<BCounterProps>()

const sizeClass = computed(() => {
  if (props.size === 'md') return 'min-w-5 text-meta leading-5'
  return 'min-w-[18px] text-tiny leading-[18px]'
})
</script>

<template>
  <span
    class="rounded-pill bg-brand px-xxs text-center font-headline font-bold text-on-brand tabular-nums"
    :class="sizeClass"
  >{{ value }}</span>
</template>
