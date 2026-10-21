/**
 * Lo que el vecino le dice al feed desde el menú "···" de cada publicación:
 * "Me interesa" (ver más como esta) y "No me interesa" (se oculta, con opción de deshacer).
 * Son excluyentes: ocultar una publicación quita el "me interesa" y viceversa.
 *
 * ⚠️ TEMPORAL — en memoria. Con backend, se envía al servidor para ordenar el feed.
 */
export const useFeedPrefsStore = defineStore('feedPrefs', () => {
  const interestedIds = ref<string[]>([])
  const hiddenIds = ref<string[]>([])

  const isInterested = (postId: string) => interestedIds.value.includes(postId)
  const isHidden = (postId: string) => hiddenIds.value.includes(postId)

  function toggleInterested(postId: string) {
    if (isInterested(postId)) {
      interestedIds.value = interestedIds.value.filter((id) => id !== postId)
      return
    }
    interestedIds.value = [...interestedIds.value, postId]
    hiddenIds.value = hiddenIds.value.filter((id) => id !== postId)
  }

  function hide(postId: string) {
    if (!isHidden(postId)) hiddenIds.value = [...hiddenIds.value, postId]
    interestedIds.value = interestedIds.value.filter((id) => id !== postId)
  }

  function unhide(postId: string) {
    hiddenIds.value = hiddenIds.value.filter((id) => id !== postId)
  }

  return { interestedIds, hiddenIds, isInterested, isHidden, toggleInterested, hide, unhide }
})
