<script setup lang="ts">
defineProps<{
  title: string
  caption?: string
  image?: string
  logo?: string
}>()
</script>

<template>
  <section class="relative flex min-h-screen items-end overflow-hidden bg-canvas text-on-dark">
    <img v-if="image" :src="image" alt="" class="absolute inset-0 size-full object-cover">
    <div class="absolute inset-0 bg-linear-to-t from-canvas via-transparent to-transparent" />

    <div class="container-content relative py-24">
      <p v-if="caption" class="type-caption mb-md text-on-photo">{{ caption }}</p>
      <h1 v-if="logo">
        <img :src="logo" :alt="title" width="787" height="678" class="h-40 w-auto md:h-64">
      </h1>
      <h1 v-else class="text-display-md md:text-display-xl">{{ title }}</h1>
      <div v-if="$slots.default" class="mt-xl flex flex-wrap gap-md">
        <slot />
      </div>
    </div>
  </section>
</template>
