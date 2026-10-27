/**
 * Endpoints de historias (24 h) de los negocios.
 *
 * ⚠️ TEMPORAL — datos dummy con latencia simulada.
 * Cuando exista el backend, este archivo pasa a llamar a la API real.
 */

import { makeMockStories } from './mock'
import type { Story } from '~/api/types'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export const storiesApi = {
  /** Historias visibles en el raíl superior del feed. */
  async list(): Promise<Story[]> {
    await wait(200)
    return makeMockStories()
  }
}
