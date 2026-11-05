<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

/**
 * Botón en forma de píldora, el de toda la app:
 *  - `outline` (por defecto): contorno fino, acciones secundarias (Ver negocio, Deshacer, Cómo llegar).
 *  - `primary`: ocre, la acción principal (lo que te toca hacer: Apartar cita).
 * Alto según `size`: sm 32px · md 36px · lg 40px (por defecto) · xl 48px. `block` ocupa todo el ancho.
 * `icon` va antes del texto. Con `to` es un enlace (`external` lo abre en otra pestaña); sin él, un botón.
 */
interface BButtonProps {
  variant?: 'outline' | 'primary'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: string
  block?: boolean
  to?: RouteLocationRaw
  external?: boolean
  type?: 'button' | 'submit'
  disabled?: boolean
}

const VARIANTS = {
  outline: 'border border-hairline-strong text-body-strong hover:bg-surface-elevated',
  primary: 'bg-brand text-on-brand hover:bg-brand-hover disabled:hover:bg-brand'
}

const SIZES = {
  sm: { box: 'h-8 px-sm text-support', icon: 16 },
  md: { box: 'h-9 px-md text-label', icon: 18 },
  lg: { box: 'h-10 px-md text-label', icon: 20 },
  xl: { box: 'h-12 px-lg text-copy', icon: 20 }
}

const props = defineProps<BButtonProps>()

const iconSize = computed(() => SIZES[props.size ?? 'lg'].icon)

const classes = computed(() => [
  'inline-flex shrink-0 items-center justify-center gap-xs rounded-pill font-semibold transition-colors disabled:opacity-40',
  VARIANTS[props.variant ?? 'outline'],
  SIZES[props.size ?? 'lg'].box,
  { 'w-full': props.block }
])

/** Los enlaces externos se abren en otra pestaña. */
const target = computed(() => (props.external ? '_blank' : undefined))
const rel = computed(() => (props.external ? 'noopener' : undefined))
</script>

<template>
  <NuxtLink v-if="to" :to="to" :target="target" :rel="rel" :class="classes">
    <Icon v-if="icon" :name="icon" :size="iconSize" aria-hidden="true" />
    <slot />
  </NuxtLink>
  <button v-else :type="type ?? 'button'" :disabled="disabled" :class="classes">
    <Icon v-if="icon" :name="icon" :size="iconSize" aria-hidden="true" />
    <slot />
  </button>
</template>
