/**
 * Endpoints de notificaciones del vecino.
 *
 * ⚠️ TEMPORAL — datos dummy con latencia simulada.
 * Cuando exista el backend, este archivo pasa a llamar a la API real:
 *
 *   list: () => api('/me/notifications')
 */

import { makeMockNotifications } from './mock/notifications'
import type { AppNotification } from './types'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export const notificationsApi = {
  /** Notificaciones del vecino, de la más reciente a la más antigua. */
  async list(): Promise<AppNotification[]> {
    await wait(200)
    return makeMockNotifications(Date.now())
  }
}
