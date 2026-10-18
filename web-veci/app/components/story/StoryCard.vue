<script setup lang="ts">
import type { Story } from '~/api/types'
import { useStoriesStore } from '~/stores/stories'

const props = defineProps<{ story: Story }>()
defineEmits<{ open: [] }>()

const store = useStoriesStore()
const seen = computed(() => props.story.seen || store.isSeen(props.story.id))
</script>

<template>
  <button
    type="button"
    class="group flex w-20 shrink-0 snap-start flex-col items-center gap-xs text-center"
    :aria-label="`Ver historia de ${props.story.business.name}: ${props.story.kind}${seen ? ' (vista)' : ''}`"
    @click="$emit('open')"
  >
    <!-- Anillo: degradado si no se ha visto, gris si ya se vio -->
    <span
      class="inline-flex rounded-full p-[3px] transition-transform group-hover:scale-105"
      :class="seen ? 'bg-hairline-strong' : 'bg-veci-gradient'"
      aria-hidden="true"
    >
      <span class="rounded-full border-[3px] border-canvas">
        <StoryAvatar :icon="props.story.business.icon" size="lg" />
      </span>
    </span>

    <span
      class="block w-full truncate text-body-xs"
      :class="seen ? 'text-muted' : 'font-semibold text-ink'"
    >
      {{ props.story.business.name }}
    </span>
  </button>
</template>
