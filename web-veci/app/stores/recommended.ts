/**
 * Negocios que el vecino recomienda (suman al "N vecinos lo recomiendan").
 * Se recomienda al negocio, no a la publicación: no hay "me gusta" (docs/business-model.md).
 *
 * ⚠️ TEMPORAL — en memoria. Con backend, pasa a estado de servidor (TanStack Query).
 */
export const useRecommendedStore = defineStore('recommended', () => {
  const ids = ref<string[]>([])

  function isRecommended(businessId: string) {
    return ids.value.includes(businessId)
  }

  function toggle(businessId: string) {
    ids.value = isRecommended(businessId)
      ? ids.value.filter((id) => id !== businessId)
      : [businessId, ...ids.value]
  }

  return { ids, isRecommended, toggle }
})
