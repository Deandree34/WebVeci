<script setup lang="ts">
defineProps<{ title: string, image?: string }>()
</script>

<template>
  <section class="relative overflow-hidden bg-canvas text-on-dark">
    <img v-if="image" :src="image" alt="" class="absolute inset-0 size-full object-cover opacity-60">
    <div class="container-content relative flex flex-col items-start gap-xl py-20">
      <h2 class="text-veci-gradient text-display-sm md:text-display-md">{{ title }}</h2>
      <slot />
    </div>
  </section>
</template>
