/**
 * Notificaciones que el vecino ya leyó (las demás cuentan en el contador).
 *
 * ⚠️ TEMPORAL — en memoria. Con backend, "leída" se guarda en el servidor.
 */
export const useNotificationsStore = defineStore('notifications', () => {
  const read = new IdList()

  function isRead(id: string) {
    return read.has(id)
  }

  function markRead(id: string) {
    read.add(id)
  }

  function markAllRead(ids: string[]) {
    read.addMany(ids)
  }

  return { readIds: read.ids, isRead, markRead, markAllRead }
})
