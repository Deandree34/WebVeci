/** Endpoints de avisos de la colonia. */

import { api } from '~/api/client'
import type { Notice } from '~/api/types'

export const noticesApi = {
  /** Próximos avisos de la colonia, ordenados por fecha. */
  list: () => api<Notice[]>('/notices')
}
