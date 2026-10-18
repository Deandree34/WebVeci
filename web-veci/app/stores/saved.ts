/**
 * Negocios guardados por el vecino (sus lugares de confianza; solo los ve él).
 *
 * ⚠️ TEMPORAL — en memoria. Con backend, pasa a estado de servidor (TanStack Query).
 */
export const useSavedStore = defineStore('saved', () => {
  const ids = ref<string[]>([])

  const count = computed(() => ids.value.length)

  function isSaved(businessId: string) {
    return ids.value.includes(businessId)
  }

  function toggle(businessId: string) {
    ids.value = isSaved(businessId)
      ? ids.value.filter((id) => id !== businessId)
      : [businessId, ...ids.value]
  }

  return { ids, count, isSaved, toggle }
})
