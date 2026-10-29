/**
 * Historias vistas por el vecino en esta sesión (se combinan con `story.seen` de la API).
 *
 * ⚠️ TEMPORAL — en memoria. Con backend, marcar como vista será una mutación.
 */
export const useStoriesStore = defineStore('stories', () => {
  const seen = new IdList()

  function isSeen(storyId: string) {
    return seen.has(storyId)
  }

  function markSeen(storyId: string) {
    seen.add(storyId)
  }

  return { seenIds: seen.ids, isSeen, markSeen }
})
