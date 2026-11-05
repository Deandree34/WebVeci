/** Endpoints de notificaciones del vecino. */

import { api } from '~/api/client'
import type { NotificationPage } from '~/api/types'

export const notificationsApi = {
  /**
   * Notificaciones del vecino, de la más reciente a la más antigua.
   * Paginadas por cursor; `queries.ts` expone solo los items.
   */
  list: () => api<NotificationPage>('/me/notifications')
}
