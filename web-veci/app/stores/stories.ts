/**
 * Historias vistas por el vecino en esta sesión (se combinan con `story.seen` de la API).
 *
 * ⚠️ TEMPORAL — en memoria. Con backend, marcar como vista será una mutación.
 */
export const useStoriesStore = defineStore('stories', () => {
  const seenIds = ref<string[]>([])

  function isSeen(storyId: string) {
    return seenIds.value.includes(storyId)
  }

  function markSeen(storyId: string) {
    if (!isSeen(storyId)) seenIds.value = [...seenIds.value, storyId]
  }

  return { seenIds, isSeen, markSeen }
})
