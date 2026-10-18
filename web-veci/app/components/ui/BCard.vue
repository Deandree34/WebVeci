<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'callout' | 'photo' | 'article' | 'flush'
  title?: string
  image?: string
}>(), {
  variant: 'article'
})

const variants = {
  callout: 'w-80 max-w-full bg-surface-card p-md text-body-sm',
  photo: 'bg-canvas',
  article: 'bg-surface-card p-lg',
  // Sin padding: el contenido controla sus márgenes (p. ej. imagen a sangre en un post)
  flush: 'bg-surface-card'
}

const titleClass = computed(() => props.variant === 'photo' ? 'text-display-sm md:text-display-md' : 'text-title-md')
</script>

<template>
  <article class="overflow-hidden rounded-card text-on-dark" :class="variants[variant]">
    <div v-if="image" class="relative overflow-hidden" :class="variant === 'article' ? 'mb-lg aspect-video' : 'aspect-4/3'">
      <img :src="image" alt="" class="size-full object-cover">
      <h3 v-if="variant === 'photo' && title" class="absolute bottom-lg left-lg" :class="titleClass">{{ title }}</h3>
    </div>
    <div v-if="$slots.meta" class="mb-xs flex gap-md"><slot name="meta" /></div>
    <h3 v-if="title && variant !== 'photo'" class="mb-xs" :class="titleClass">{{ title }}</h3>
    <div class="text-body"><slot /></div>
  </article>
</template>
