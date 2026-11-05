/**
 * Lo que el vecino le dice al feed desde el menú "···" de cada publicación:
 * "Me interesa" (ver más como esta) y "No me interesa" (se oculta, con opción de deshacer).
 * Son excluyentes: ocultar una publicación quita el "me interesa" y viceversa.
 *
 * ⚠️ TEMPORAL — en memoria. Con backend, se envía al servidor para ordenar el feed.
 */
export const useFeedPrefsStore = defineStore('feedPrefs', () => {
  const interested = new IdList()
  const hidden = new IdList()

  function isInterested(postId: string) {
    return interested.has(postId)
  }

  function isHidden(postId: string) {
    return hidden.has(postId)
  }

  function toggleInterested(postId: string) {
    if (interested.has(postId)) {
      interested.remove(postId)
      return
    }
    interested.add(postId)
    hidden.remove(postId)
  }

  function hide(postId: string) {
    hidden.add(postId)
    interested.remove(postId)
  }

  function unhide(postId: string) {
    hidden.remove(postId)
  }

  return {
    interestedIds: interested.ids,
    hiddenIds: hidden.ids,
    isInterested,
    isHidden,
    toggleInterested,
    hide,
    unhide
  }
})

/**
 * Fotos de publicaciones a las que el vecino reaccionó (en la vista del post en lista). Es el mismo
 * apretón de manos de Recomendar, pero con un contador por foto (docs/business-model.md).
 *
 * ⚠️ TEMPORAL — en memoria. Con backend, pasa a estado de servidor (TanStack Query).
 */
export const usePhotoLikesStore = defineStore('photoLikes', () => {
  const list = new IdList()

  function isLiked(photoId: string) {
    return list.has(photoId)
  }

  function toggle(photoId: string) {
    list.toggle(photoId)
  }

  return { ids: list.ids, isLiked, toggle }
})
