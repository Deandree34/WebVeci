<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'muted' | 'brand' | 'accent' }>(), { tone: 'muted' })

const tones = {
  muted: 'bg-transparent text-muted',
  brand: 'rounded-pill border border-veci-purple bg-transparent px-xs py-xxs text-veci-purple-text',
  accent: 'rounded-pill bg-veci-pink px-xs py-xxs text-on-accent'
}
</script>

<template>
  <span class="type-caption" :class="tones[tone]"><slot /></span>
</template>
