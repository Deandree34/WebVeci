<script setup lang="ts">
/**
 * Etiqueta neutra con ícono opcional (el giro del negocio, las formas de pago, el tipo de post).
 * `outline` (por defecto): contorno fino; `filled`: fondo gris sin borde.
 */
interface BChipProps {
  icon?: string
  variant?: 'outline' | 'filled'
}

const props = defineProps<BChipProps>()

const variantClass = computed(() => {
  if (props.variant === 'filled') return 'bg-surface-elevated text-body-xs'
  return 'border border-hairline-strong text-support'
})
</script>

<template>
  <span class="inline-flex items-center gap-xxs rounded-pill px-sm py-xxs font-medium text-body" :class="variantClass">
    <Icon v-if="icon" :name="icon" size="14" aria-hidden="true" />
    <slot />
  </span>
</template>
