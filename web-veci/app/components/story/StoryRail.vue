<script setup lang="ts">
import { useStories } from '~/features/stories/queries'

// Solo los negocios (y VECI) publican historias: el vecino no crea las suyas
const { data: stories, isPending } = useStories()

/** Historia abierta en el visor (`null` = cerrado). */
const openIndex = ref<number | null>(null)
</script>

<template>
  <section class="mb-lg" aria-label="Historias de hoy">
    <div class="flex snap-x gap-md overflow-x-auto pb-xs [scrollbar-width:none]">
      <template v-if="isPending">
        <span
          v-for="n in 6"
          :key="n"
          class="flex w-20 shrink-0 snap-start flex-col items-center gap-xs"
          aria-hidden="true"
        >
          <span class="size-[76px] animate-pulse rounded-full bg-surface-card" />
          <span class="h-3 w-12 animate-pulse rounded-pill bg-surface-card" />
        </span>
      </template>
      <template v-else>
        <StoryCard v-for="(story, i) in stories" :key="story.id" :story="story" @open="openIndex = i" />
      </template>
    </div>

    <StoryViewer v-if="stories?.length" v-model:index="openIndex" :stories="stories" />
  </section>
</template>
