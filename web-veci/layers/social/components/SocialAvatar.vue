<script setup lang="ts">
/** Avatar de una persona: sus iniciales (máximo 2) en un círculo gris. `size`: xs · sm · md (por defecto) · lg. */
interface SocialAvatarProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const SIZES = {
  xs: 'size-6 text-tiny',
  sm: 'size-8 text-body-xs',
  md: 'size-10 text-body-sm',
  lg: 'size-12 text-body-md'
}

const props = defineProps<SocialAvatarProps>()

const sizeClass = computed(() => SIZES[props.size ?? 'md'])

/** Iniciales (máximo 2) a partir del nombre. */
const initials = computed(() =>
  props.name
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
)
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center rounded-full bg-surface-elevated font-medium text-body-strong"
    :class="sizeClass"
    aria-hidden="true"
  >
    {{ initials }}
  </span>
</template>
