/** Endpoints de la cuenta del vecino. */

import { api } from '~/api/client'
import type { Person } from '~/api/types'

export const peopleApi = {
  /** Cuenta autenticada. */
  me: () => api<Person>('/me')
}
