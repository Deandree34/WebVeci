<script setup lang="ts">
const props = withDefaults(defineProps<{ name: string, size?: 'xs' | 'sm' | 'md' | 'lg' }>(), {
  size: 'md'
})

const sizes = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-body-xs',
  md: 'size-10 text-body-sm',
  lg: 'size-12 text-body-md'
}

/** Iniciales (máximo 2) a partir del nombre. */
const initials = computed(() =>
  props.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]!.toUpperCase())
    .join('')
)
</script>

<template>
  <span
    class="inline-flex shrink-0 items-center justify-center rounded-full bg-surface-elevated font-medium text-body-strong"
    :class="sizes[size]"
    aria-hidden="true"
  >
    {{ initials }}
  </span>
</template>
