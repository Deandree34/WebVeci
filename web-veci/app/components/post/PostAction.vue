<script setup lang="ts">
withDefaults(defineProps<{ to: string, variant?: 'primary' | 'neutral' }>(), { variant: 'neutral' })

const variants = {
  primary: 'bg-veci-gradient text-on-primary hover:brightness-110',
  neutral: 'bg-surface-elevated text-on-dark hover:bg-hairline-strong'
}
</script>

<template>
  <NuxtLink
    :to="to"
    class="inline-flex items-center justify-center gap-xxs rounded-control px-md py-xs text-body-sm font-medium transition"
    :class="variants[variant]"
  >
    <slot />
  </NuxtLink>
</template>
