/**
 * Negocios guardados por el vecino (sus lugares de confianza; solo los ve él).
 *
 * ⚠️ TEMPORAL — en memoria. Con backend, pasa a estado de servidor (TanStack Query).
 */
export const useSavedStore = defineStore('saved', () => {
  const list = new IdList()

  const count = computed(() => list.ids.value.length)

  function isSaved(businessId: string) {
    return list.has(businessId)
  }

  function toggle(businessId: string) {
    list.toggle(businessId)
  }

  return { ids: list.ids, count, isSaved, toggle }
})

/**
 * Negocios que el vecino recomienda (suman al "N vecinos lo recomiendan").
 * Se recomienda al negocio, no a la publicación: no hay "me gusta" (docs/business-model.md).
 *
 * ⚠️ TEMPORAL — en memoria. Con backend, pasa a estado de servidor (TanStack Query).
 */
export const useRecommendedStore = defineStore('recommended', () => {
  const list = new IdList()

  function isRecommended(businessId: string) {
    return list.has(businessId)
  }

  function toggle(businessId: string) {
    list.toggle(businessId)
  }

  return { ids: list.ids, isRecommended, toggle }
})
