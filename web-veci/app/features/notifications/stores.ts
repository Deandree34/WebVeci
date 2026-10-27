/**
 * Notificaciones que el vecino ya leyó (las demás cuentan en el contador).
 *
 * ⚠️ TEMPORAL — en memoria. Con backend, "leída" se guarda en el servidor.
 */
export const useNotificationsStore = defineStore('notifications', () => {
  const readIds = ref<string[]>([])

  function isRead(id: string) {
    return readIds.value.includes(id)
  }

  function markRead(id: string) {
    if (!isRead(id)) readIds.value = [...readIds.value, id]
  }

  function markAllRead(ids: string[]) {
    readIds.value = [...new Set([...readIds.value, ...ids])]
  }

  return { readIds, isRead, markRead, markAllRead }
})
