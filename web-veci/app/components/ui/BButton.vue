<script setup lang="ts">
const props = withDefaults(defineProps<{
  to?: string
  variant?: 'outline' | 'solid'
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'outline',
  type: 'button'
})

const variants = {
  outline: 'border-hairline-strong bg-transparent text-on-dark hover:border-primary',
  solid: 'border-primary bg-primary text-on-primary hover:border-primary-hover hover:bg-primary-hover'
}

const classes = computed(() => [
  'type-button inline-flex h-11 items-center justify-center rounded-pill border px-8 py-3.5 transition',
  variants[props.variant]
])
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="classes"><slot /></NuxtLink>
  <button v-else :type="type" :class="classes"><slot /></button>
</template>
