/**
 * Endpoints de avisos de la colonia.
 *
 * ⚠️ TEMPORAL — datos dummy con latencia simulada.
 * Cuando exista el backend, este archivo pasa a llamar a la API real.
 */

import { makeMockNotices } from './mock'
import type { Notice } from '~/api/types'

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export const noticesApi = {
  /** Próximos avisos de la colonia, ordenados por fecha. */
  async list(): Promise<Notice[]> {
    await wait(200)
    return makeMockNotices(Date.now())
  }
}
