/** Endpoints de notificaciones del vecino. */

import { api } from '~/api/client'
import type { AppNotification } from '~/api/types'

export const notificationsApi = {
  /** Notificaciones del vecino, de la más reciente a la más antigua. */
  list: () => api<AppNotification[]>('/me/notifications')
}
