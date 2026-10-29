<script setup lang="ts">
import type { Story } from '~/api/types'
import { useStoriesStore } from '../stores'

/**
 * Historia en el carrusel: anillo ocre si no se ha visto (gris si ya), el avatar del negocio y su
 * nombre corto en Lora cursiva ("El Güero"; el completo va en el `aria-label`). Al tocarla emite `open`.
 */
interface StoryCardProps {
  story: Story
}

interface StoryCardEmits {
  open: []
}

const props = defineProps<StoryCardProps>()
defineEmits<StoryCardEmits>()

const store = useStoriesStore()
const seen = computed(() => props.story.seen || store.isSeen(props.story.id))
const name = computed(() => shortName(props.story.business))

const label = computed(() => {
  const base = `Ver historia de ${props.story.business.name}: ${props.story.kind}`
  if (seen.value) return `${base} (vista)`
  return base
})
</script>

<template>
  <button
    type="button"
    class="group flex w-16 shrink-0 snap-start flex-col items-center gap-xxs text-center"
    :aria-label="label"
    @click="$emit('open')"
  >
    <!-- Anillo: ocre si no se ha visto, gris si ya se vio -->
    <span
      class="inline-flex rounded-full p-[3px] transition-transform group-hover:scale-105"
      :class="seen ? 'bg-hairline-strong' : 'bg-brand'"
      aria-hidden="true"
    >
      <span class="rounded-full border-[3px] border-canvas">
        <StoryAvatar :icon="story.business.icon" size="md" />
      </span>
    </span>

    <!-- Nombre corto ("El Güero") en Lora cursiva: el completo va en el aria-label -->
    <span
      class="block w-full truncate font-quote text-label leading-[1.3] font-medium italic"
      :class="seen ? 'text-muted' : 'text-ink'"
    >
      {{ name }}
    </span>
  </button>
</template>
