/** Endpoints de historias (24 h) de los negocios. */

import { api } from '~/api/client'
import type { Story } from '~/api/types'

export const storiesApi = {
  /** Historias visibles en el raíl superior del feed. */
  list: () => api<Story[]>('/stories')
}
