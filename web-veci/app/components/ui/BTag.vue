<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'muted' | 'brand' | 'accent' }>(), { tone: 'muted' })

const tones = {
  muted: 'bg-transparent text-muted',
  brand: 'rounded-pill border border-brand bg-transparent px-xs py-xxs text-brand',
  accent: 'rounded-pill bg-brand px-xs py-xxs text-on-brand'
}
</script>

<template>
  <span class="type-caption" :class="tones[tone]"><slot /></span>
</template>
